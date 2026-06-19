import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { MarkNotificationsReadRequest } from '#shared/features/notifications';

import { MarkNotificationsReadAbility } from '#shared/features/notifications/notification.ability';

export const markNotificationsReadEventHandlerFn: EventHandlerFn<
  MarkNotificationsReadRequest
> = async ({ ability, body, userSession }) => {
  await ability.authorize(MarkNotificationsReadAbility);

  const session = await userSession.require();

  return markNotificationsRead(session.user.id, body);
};
