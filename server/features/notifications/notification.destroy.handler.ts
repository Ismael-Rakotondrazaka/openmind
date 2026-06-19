import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { DestroyNotificationRequest } from '#shared/features/notifications';

import { DestroyNotificationAbility } from '#shared/features/notifications/notification.ability';

export const destroyNotificationEventHandlerFn: EventHandlerFn<
  DestroyNotificationRequest
> = async ({ ability, params }) => {
  const notification = await getNotification(params.notificationId);

  if (notification === null) {
    throw Exception.notFound({ data: {} });
  }

  await ability.authorize(DestroyNotificationAbility, notification);

  await deleteNotification(params.notificationId, notification.recipientId);

  return { data: notification };
};
