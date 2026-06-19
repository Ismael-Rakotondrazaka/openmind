import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { UpdateNotificationPreferenceRequest } from '#shared/features/notifications';

import { UpdateNotificationPreferenceAbility } from '#shared/features/notifications/notification.ability';

export const updateNotificationPreferenceEventHandlerFn: EventHandlerFn<
  UpdateNotificationPreferenceRequest
> = async ({ ability, body, userSession }) => {
  await ability.authorize(UpdateNotificationPreferenceAbility);

  const session = await userSession.require();
  const preference = await upsertNotificationPreference(session.user.id, body);

  return { data: preference };
};
