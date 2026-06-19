import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { IndexNotificationPreferencesRequest } from '#shared/features/notifications';

import { IndexNotificationPreferencesAbility } from '#shared/features/notifications/notification.ability';

export const indexNotificationPreferencesEventHandlerFn: EventHandlerFn<
  IndexNotificationPreferencesRequest
> = async ({ ability, userSession }) => {
  await ability.authorize(IndexNotificationPreferencesAbility);

  const session = await userSession.require();

  return getNotificationPreferences(session.user.id);
};
