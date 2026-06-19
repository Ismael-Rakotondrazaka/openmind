import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { IndexNotificationsRequest } from '#shared/features/notifications';

import { IndexNotificationsAbility } from '#shared/features/notifications/notification.ability';

export const indexNotificationsEventHandlerFn: EventHandlerFn<
  IndexNotificationsRequest
> = async ({ ability, query, userSession }) => {
  await ability.authorize(IndexNotificationsAbility);

  const session = await userSession.require();

  return getNotifications(session.user.id, query);
};
