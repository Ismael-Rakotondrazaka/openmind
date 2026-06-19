import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { ToggleReactionRequest } from '#shared/features/reactions';

import { ToggleReactionAbility } from '#shared/features/reactions';

import { toggleReaction } from './reaction.service';

export const toggleReactionEventHandlerFn: EventHandlerFn<
  ToggleReactionRequest
> = async ({ ability, body, userSession }) => {
  await ability.authorize(ToggleReactionAbility);
  const session = await userSession.require();
  return toggleReaction(session.user.id, body);
};
