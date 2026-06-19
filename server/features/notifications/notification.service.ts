import type {
  IndexNotificationsQuery,
  MarkNotificationsReadBody,
  NotificationModel,
  NotificationPreferenceModel,
  NotificationWithActor,
  UpdateNotificationPreferenceBody,
} from '#shared/features/notifications';
import type { PaginationResult } from '#shared/features/paginations';

import { NotificationConfig } from '#shared/features/notifications';

const userSelect = {
  createdAt: true,
  firstName: true,
  followerCount: true,
  followingCount: true,
  id: true,
  imageUrl: true,
  lastName: true,
  postsCount: true,
  role: true,
  username: true,
};

export const getNotification = async (
  id: string
): Promise<NotificationModel | null> => {
  return prisma.notification.findUnique({
    where: { id },
  }) as Promise<NotificationModel | null>;
};

export const deleteNotification = async (
  id: string,
  recipientId: string
): Promise<void> => {
  const notification = await prisma.notification.findUnique({
    select: { readAt: true },
    where: { id },
  });

  await prisma.$transaction([
    prisma.notification.delete({ where: { id } }),
    ...(notification?.readAt === null
      ? [
          prisma.user.update({
            data: { unreadNotificationsCount: { decrement: 1 } },
            where: { id: recipientId },
          }),
        ]
      : []),
  ]);
};

export const getNotifications = async (
  userId: string,
  filters: IndexNotificationsQuery
): Promise<
  { unreadCount: number } & PaginationResult<NotificationWithActor>
> => {
  const page = filters.page ?? NotificationConfig.PAGE_DEFAULT;
  const pageSize = filters.pageSize ?? NotificationConfig.PAGE_SIZE_DEFAULT;
  const skip = (page - 1) * pageSize;

  const where = {
    recipientId: userId,
    ...(filters.unreadOnly ? { readAt: null } : {}),
  };

  const [rows, count, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      include: { actorUser: { select: userSelect } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      where,
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { readAt: null, recipientId: userId } }),
  ]);

  return {
    count,
    data: rows as unknown as NotificationWithActor[],
    unreadCount,
  };
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
