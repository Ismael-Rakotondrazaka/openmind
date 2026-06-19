import type { InputJsonValue } from '@prisma/client/runtime/client';
import type {
  IndexNotificationsQuery,
  MarkNotificationsReadBody,
  NotificationModel,
  NotificationPreferenceModel,
  UpdateNotificationPreferenceBody,
} from '#shared/features/notifications';

import { wsRegistry } from '#server/utils/ws-registry';
import {
  notificationsTopic,
  WsNotificationMessageType,
} from '#shared/features/notifications';
import { WsEvent } from '#shared/utils/ws';

import { buildPagination } from '../../core/paginations/pagination';

type NotificationGroup = 'comments' | 'follows' | 'reactions';

const NOTIFICATION_TYPE_TO_GROUP: Partial<Record<string, NotificationGroup>> = {
  comment_reacted: 'reactions',
  comment_replied: 'comments',
  post_commented: 'comments',
  post_reacted: 'reactions',
  user_followed: 'follows',
};

export const enqueueNotification = async (params: {
  actorId: null | string;
  channels?: string[];
  data?: Record<string, unknown>;
  processAfter?: Date;
  recipientId: string;
  type: string;
}): Promise<void> => {
  const {
    actorId,
    data = {},
    processAfter = new Date(),
    recipientId,
    type,
  } = params;
  let channels = params.channels ?? ['in_app'];

  if (actorId !== null && recipientId === actorId) return;

  const group = NOTIFICATION_TYPE_TO_GROUP[type];

  if (group) {
    const disabledPrefs = await prisma.notificationPreference.findMany({
      select: { channel: true },
      where: {
        channel: { in: channels },
        enabled: false,
        groupName: group,
        userId: recipientId,
      },
    });

    const disabledSet = new Set(disabledPrefs.map(p => p.channel));
    channels = channels.filter(ch => !disabledSet.has(ch));

    if (channels.length === 0) return;
  }

  await prisma.notificationQueue.create({
    data: {
      actorId,
      channels,
      data: data as InputJsonValue,
      processAfter,
      recipientId,
      type,
    },
  });
};

export const getUnreadNotificationsCount = async (
  userId: string
): Promise<{ count: number }> => {
  const count = await prisma.notification.count({
    where: { readAt: null, recipientId: userId },
  });
  return { count };
};

export const getNotifications = async (
  userId: string,
  query: IndexNotificationsQuery
): Promise<{
  data: NotificationModel[];
  totalCount: number;
  unreadCount: number;
}> => {
  const { skip, take } = buildPagination(query);

  const where = {
    recipientId: userId,
    ...(query.unreadOnly ? { readAt: null } : {}),
  };

  const [data, totalCount, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      where,
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { readAt: null, recipientId: userId } }),
  ]);

  return { data: data as NotificationModel[], totalCount, unreadCount };
};

export const markNotificationsRead = async (
  userId: string,
  body: MarkNotificationsReadBody
): Promise<{ count: number }> => {
  const where = {
    readAt: null,
    recipientId: userId,
    ...(body.ids ? { id: { in: body.ids } } : {}),
  };

  const { count } = await prisma.notification.updateMany({
    data: { readAt: new Date() },
    where,
  });

  if (count > 0) {
    await prisma.user.update({
      data: { unreadNotificationsCount: { decrement: count } },
      where: { id: userId },
    });
  }

  return { count };
};

export const getNotificationPreferences = async (
  userId: string
): Promise<NotificationPreferenceModel[]> => {
  return prisma.notificationPreference.findMany({
    orderBy: { groupName: 'asc' },
    where: { userId },
  }) as Promise<NotificationPreferenceModel[]>;
};

const BATCH_SIZE = 50;

export const processNotificationQueue = async (): Promise<void> => {
  const now = new Date();

  await prisma.notificationQueue.updateMany({
    data: { status: 'processing' },
    where: { processAfter: { lte: now }, status: 'pending' },
  });

  const items = await prisma.notificationQueue.findMany({
    take: BATCH_SIZE,
    where: { status: 'processing' },
  });

  for (const item of items) {
    try {
      if (item.channels.includes('in_app')) {
        const [notification] = await prisma.$transaction([
          prisma.notification.create({
            data: {
              actorId: item.actorId,
              data: item.data as InputJsonValue,
              recipientId: item.recipientId,
              type: item.type,
            },
          }),
          prisma.user.update({
            data: { unreadNotificationsCount: { increment: 1 } },
            where: { id: item.recipientId },
          }),
        ]);

        wsRegistry.broadcast(notificationsTopic(item.recipientId), {
          event: WsEvent.INSERT,
          record: notification,
          type: WsNotificationMessageType,
        });
      }

      await prisma.notificationQueue.update({
        data: { status: 'processed' },
        where: { id: item.id },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await prisma.notificationQueue.update({
        data: { errorMessage: message, status: 'failed' },
        where: { id: item.id },
      });
    }
  }
};

export const upsertNotificationPreference = async (
  userId: string,
  body: UpdateNotificationPreferenceBody
): Promise<NotificationPreferenceModel> => {
  return prisma.notificationPreference.upsert({
    create: {
      channel: body.channel,
      enabled: body.enabled,
      groupName: body.groupName,
      userId,
    },
    update: { enabled: body.enabled },
    where: {
      userId_groupName_channel: {
        channel: body.channel,
        groupName: body.groupName,
        userId,
      },
    },
  }) as Promise<NotificationPreferenceModel>;
};
