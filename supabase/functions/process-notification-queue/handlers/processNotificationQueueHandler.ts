import { createFactory } from '@hono/hono/factory';

import type { Json } from '../../../../shared/types/database.ts';

import { NotificationType } from '../../_shared/features/notifications/notification.model.ts';
import { createSupabaseServiceClient } from '../../_shared/services/supabase/client.ts';
import { apiResponse } from '../../_shared/utils/responses.ts';

// Notification types where multiple queue events collapse into one inbox row.
// The aggregate key is "{type}:{entity_id}" and acts as the upsert target.
const AGGREGATABLE_TYPES = new Set<NotificationType>([
  NotificationType.comment_reacted,
  NotificationType.post_reacted,
]);

type NotificationGroup = {
  // How many actors are in this batch (used to increment data.actor_count).
  actorCountDelta: number;
  actorId: null | string;
  aggregateKey: null | string;
  // Merged data from all items in the group; latest actor's data wins for
  // non-count fields.
  data: Record<string, unknown>;
  queueIds: string[];
  recipientId: string;
  type: NotificationType;
};

type QueueItem = {
  actor_id: null | string;
  channels: string[];
  data: Record<string, unknown>;
  id: string;
  recipient_id: string;
  type: NotificationType;
};

function getAggregateKey(item: QueueItem): null | string {
  switch (item.type) {
    case NotificationType.comment_reacted:
      return item.data.comment_id
        ? `${NotificationType.comment_reacted}:${item.data.comment_id}`
        : null;
    case NotificationType.post_reacted:
      return item.data.post_id
        ? `${NotificationType.post_reacted}:${item.data.post_id}`
        : null;
    default:
      return null;
  }
}

const factory = createFactory();

export const processNotificationQueueHandler = factory.createHandlers(
  async () => {
    const supabase = createSupabaseServiceClient();

    // ── 1. Claim a batch ────────────────────────────────────────────────────
    const { data: items, error: claimError } = await supabase.rpc(
      'claim_notification_queue_batch',
      { p_limit: 500 }
    );

    if (claimError) {
      return apiResponse.internalServerError(claimError.message);
    }

    if (!items || items.length === 0) {
      return apiResponse.ok({ failed: 0, processed: 0 });
    }

    // ── 2. Group items ───────────────────────────────────────────────────────
    // Aggregatable types: group by recipient + aggregate key so a burst of
    // reactions to the same post becomes a single upsert.
    // Non-aggregatable types: each item is its own group (key = item.id).
    const groups = new Map<string, NotificationGroup>();

    for (const item of items as QueueItem[]) {
      const aggregateKey = getAggregateKey(item);
      const groupKey = aggregateKey
        ? `${item.recipient_id}:${aggregateKey}`
        : item.id;

      const existing = groups.get(groupKey);

      if (existing) {
        // Latest actor wins; merge data; count grows
        existing.actorId = item.actor_id;
        existing.data = { ...existing.data, ...item.data };
        existing.actorCountDelta++;
        existing.queueIds.push(item.id);
      } else {
        groups.set(groupKey, {
          actorCountDelta: 1,
          actorId: item.actor_id,
          aggregateKey,
          data: { ...item.data },
          queueIds: [item.id],
          recipientId: item.recipient_id,
          type: item.type,
        });
      }
    }

    // ── 3. Upsert notifications (in_app channel) ─────────────────────────────
    const processedIds: string[] = [];
    const failedIds: string[] = [];
    const failedErrors: string[] = [];

    for (const group of groups.values()) {
      // Only process items that include the in_app channel
      const hasInApp = (items as QueueItem[])
        .filter(i => group.queueIds.includes(i.id))
        .some(i => i.channels.includes('in_app'));

      if (!hasInApp) {
        // No in_app delivery needed; mark as processed so other channels can
        // extend this branch later
        processedIds.push(...group.queueIds);
        continue;
      }

      if (!group.actorId) {
        failedIds.push(...group.queueIds);
        failedErrors.push('Missing actor_id');
        continue;
      }

      const { error: upsertError } = await supabase.rpc('upsert_notification', {
        p_actor_count_delta: AGGREGATABLE_TYPES.has(group.type)
          ? group.actorCountDelta
          : 1,
        p_actor_id: group.actorId,
        p_aggregate_key: group.aggregateKey ?? undefined,
        p_data: group.data as Json,
        p_recipient_id: group.recipientId,
        p_type: group.type,
      });

      if (upsertError) {
        failedIds.push(...group.queueIds);
        failedErrors.push(upsertError.message);
      } else {
        processedIds.push(...group.queueIds);
      }
    }

    // ── 4. Mark queue rows ───────────────────────────────────────────────────
    const markPromises: Promise<unknown>[] = [];

    if (processedIds.length > 0) {
      markPromises.push(
        supabase.rpc('mark_notification_queue_processed', {
          p_ids: processedIds,
        }) as unknown as Promise<unknown>
      );
    }

    if (failedIds.length > 0) {
      markPromises.push(
        supabase.rpc('mark_notification_queue_failed', {
          p_error: failedErrors.join('; '),
          p_ids: failedIds,
        }) as unknown as Promise<unknown>
      );
    }

    await Promise.all(markPromises);

    return apiResponse.ok({
      failed: failedIds.length,
      processed: processedIds.length,
    });
  }
);
