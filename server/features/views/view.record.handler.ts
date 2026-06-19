import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { RecordViewRequest } from '#shared/features/views';

import { RecordViewAbility } from '#shared/features/views/view.ability';

export const recordViewEventHandlerFn: EventHandlerFn<
  RecordViewRequest
> = async ({ ability, body, userSession }) => {
  await ability.authorize(RecordViewAbility);

  const session = await userSession.get();

  return recordView(session.user?.id, body);
};
