import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { ToggleReactionRequest } from '#shared/features/reactions';

import { ToggleReactionAbility } from '#shared/features/reactions/reaction.ability';

import { onReactionCreated } from './reaction.side-effects';

export const toggleReactionEventHandlerFn: EventHandlerFn<
  ToggleReactionRequest
> = async ({ ability, body, userSession }) => {
  await ability.authorize(ToggleReactionAbility);

  const session = await userSession.require();
  const result = await toggleReaction(session.user.id, body);

  if (result.toggled && result.reaction) {
    void onReactionCreated(result.reaction);
  }

  return result;
};
