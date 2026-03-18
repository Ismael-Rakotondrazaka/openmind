-- Migration: create notifications system
-- Purpose: Two-table design for user notifications with aggregation support and multi-channel delivery.
-- Affected: public.notification_queue, public.notifications
-- Notes:
--   - No raw message text stored anywhere; type + data jsonb drive frontend i18n.
--   - notification_queue: raw events from triggers; supports delayed processing for aggregation.
--   - notifications: aggregated, user-facing inbox items; source of realtime broadcasts.
--   - Multi-channel delivery (push, email) is handled at the queue level via the channels column.
--   - Queue rows are inserted by SECURITY DEFINER helpers called from triggers, never by clients.

-- ─── notification_queue ───────────────────────────────────────────────────────
--
-- One row per raw action. Triggers write here; a periodic processor reads,
-- aggregates where needed, upserts into public.notifications, then marks rows processed.
--
-- process_after controls aggregation windows:
--   - Immediate actions (comments, follows): process_after = now()
--   - Noisy actions (reactions): process_after = now() + interval (e.g. 5 min)
--     so many reactions within the window collapse into one inbox item.

create table public.notification_queue (
  id            uuid        primary key default gen_random_uuid(),
  recipient_id  uuid        not null references public.users (id) on delete cascade,
  actor_id      uuid        references public.users (id) on delete set null,
  type          text        not null,
  -- Context payload; same semantics as notifications.data.
  -- Never store localised strings here.
  data          jsonb       not null default '{}'::jsonb,
  -- Delivery channels requested for this event.
  -- Starts as '{in_app}'; extend to '{in_app,push}' or '{in_app,push,email}' as features ship.
  channels      text[]      not null default '{in_app}',
  -- pending   → waiting to be processed (default)
  -- processed → aggregated into notifications and all channels handled
  -- failed    → processing error; inspect error_message for details
  status        text        not null default 'pending'
                            check (status in ('pending', 'processed', 'failed')),
  -- When the processor may pick this row up.
  -- Delayed for aggregatable types (reactions) so bursts collapse into one notification.
  process_after timestamptz not null default now(),
  error_message text,
  created_at    timestamptz not null default now()
);

comment on table public.notification_queue is 'Raw notification events written by triggers. A processor aggregates pending rows into public.notifications and handles per-channel delivery.';
comment on column public.notification_queue.channels      is 'Delivery channels for this event, e.g. {in_app}, {in_app,push}, {in_app,push,email}.';
comment on column public.notification_queue.status        is 'pending = awaiting processing; processed = done; failed = error (see error_message).';
comment on column public.notification_queue.process_after is 'Earliest time the processor may handle this row. Set in the future for aggregatable types (reactions) to allow burst collapsing.';
comment on column public.notification_queue.error_message is 'Populated on status=failed; stores the exception message for debugging.';

create index notification_queue_pending_idx      on public.notification_queue (process_after) where status = 'pending';
create index notification_queue_recipient_idx    on public.notification_queue (recipient_id);

alter table public.notification_queue enable row level security;

-- Queue is internal; no client access at all
create policy "No client access to notification queue"
  on public.notification_queue for all
  to authenticated, anon
  using (false);

-- ─── notifications ────────────────────────────────────────────────────────────
--
-- Aggregated, user-facing inbox items produced by the processor.
-- The UI reads this table; realtime broadcasts fire on every change.
--
-- For aggregated types (e.g. reactions) the processor upserts a single row
-- and updates data (e.g. incrementing actor list / count) rather than appending.

create table public.notifications (
  id           uuid        primary key default gen_random_uuid(),
  recipient_id uuid        not null references public.users (id) on delete cascade,
  -- Last actor for display ("Alice and 3 others reacted…").
  -- Null if that user deleted their account.
  actor_id     uuid        references public.users (id) on delete set null,
  type         text        not null,
  -- Contextual payload for i18n rendering.
  -- Common keys: post_id, post_slug, comment_id, reaction_type, actor_count.
  -- Never store localised strings here.
  data         jsonb       not null default '{}'::jsonb,
  read_at      timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.notifications is 'Aggregated, user-facing inbox items. No human-readable text stored; frontend derives message from type + data for i18n.';
comment on column public.notifications.actor_id   is 'Most recent actor; used as display actor ("Alice and N others…"). Null when actor deleted their account.';
comment on column public.notifications.type       is 'Drives the i18n message template on the frontend.';
comment on column public.notifications.data       is 'Rendering context (post_id, post_slug, comment_id, reaction_type, actor_count, …). Never store localised strings.';
comment on column public.notifications.read_at    is 'Null = unread. Set to now() when the user marks it read.';
comment on column public.notifications.updated_at is 'Updated by the processor on aggregation upserts, e.g. when a second reaction arrives.';

create index notifications_recipient_id_idx  on public.notifications (recipient_id);
create index notifications_actor_id_idx      on public.notifications (actor_id) where actor_id is not null;
create index notifications_created_at_idx    on public.notifications (recipient_id, created_at desc);
create index notifications_unread_idx        on public.notifications (recipient_id) where read_at is null;

alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select
  to authenticated
  using ( (select auth.uid()) = recipient_id );

-- No direct client insert; the processor writes here via SECURITY DEFINER
create policy "No direct client insert"
  on public.notifications for insert
  to authenticated
  with check (false);

-- Recipients can mark as read (update read_at)
create policy "Users can update their own notifications"
  on public.notifications for update
  to authenticated
  using  ( (select auth.uid()) = recipient_id )
  with check ( (select auth.uid()) = recipient_id );

create policy "Users can delete their own notifications"
  on public.notifications for delete
  to authenticated
  using ( (select auth.uid()) = recipient_id );

create trigger update_notifications_updated_at
  before update on public.notifications
  for each row
  execute function public.handle_updated_at();

-- ─── Realtime broadcast ───────────────────────────────────────────────────────
--
-- Fires on notifications (not queue) so the client only learns about
-- events that have already been aggregated and are ready to display.
-- Topic format: notifications:<recipient_id>

create or replace function public.notifications_broadcast_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform realtime.broadcast_changes(
    'notifications:' || coalesce(new.recipient_id, old.recipient_id)::text,
    tg_op,
    tg_op,
    tg_table_name,
    tg_table_schema,
    new,
    old
  );
  return coalesce(new, old);
end;
$$;

comment on function public.notifications_broadcast_changes() is 'Broadcasts notification insert/update/delete to topic notifications:<recipient_id> for Realtime subscription.';

create trigger notifications_broadcast_changes
  after insert or update or delete on public.notifications
  for each row
  execute function public.notifications_broadcast_changes();

-- Only the recipient may subscribe to their own broadcast channel
create policy "Users can only receive their own notification broadcasts"
  on realtime.messages for select
  to authenticated
  using ( topic = 'notifications:' || (select auth.uid())::text );

-- ─── Helper: enqueue a notification ──────────────────────────────────────────
--
-- Called by downstream triggers (reactions, comments, follows).
-- Self-notifications are silently skipped.
-- p_process_after defaults to now(); pass a future timestamp for aggregatable types.

create or replace function public.enqueue_notification(
  p_recipient_id  uuid,
  p_actor_id      uuid,
  p_type          text,
  p_data          jsonb       default '{}'::jsonb,
  p_channels      text[]      default '{in_app}',
  p_process_after timestamptz default now()
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Never notify a user about their own actions
  if p_recipient_id = p_actor_id then
    return;
  end if;

  insert into public.notification_queue (
    recipient_id,
    actor_id,
    type,
    data,
    channels,
    process_after
  )
  values (
    p_recipient_id,
    p_actor_id,
    p_type,
    p_data,
    p_channels,
    p_process_after
  );
end;
$$;

comment on function public.enqueue_notification(uuid, uuid, text, jsonb, text[], timestamptz) is 'Inserts a raw event into notification_queue. Silently skips self-notifications. Called only by SECURITY DEFINER trigger functions. Pass a future p_process_after to enable aggregation windows (e.g. reactions).';
