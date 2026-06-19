import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { GetUnreadNotificationsCountRequest } from '#shared/features/notifications';

import { GetUnreadNotificationsCountAbility } from '#shared/features/notifications/notification.ability';

import { getUnreadNotificationsCount } from './notification.repository';

export const getUnreadNotificationsCountEventHandlerFn: EventHandlerFn<
  GetUnreadNotificationsCountRequest
> = async ({ ability, userSession }) => {
  await ability.authorize(GetUnreadNotificationsCountAbility);

  const session = await userSession.require();

  return getUnreadNotificationsCount(session.user.id);
};
