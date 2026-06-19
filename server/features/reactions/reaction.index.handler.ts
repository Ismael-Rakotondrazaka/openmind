import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { IndexReactionsRequest } from '#shared/features/reactions';

import { IndexReactionsAbility } from '#shared/features/reactions/reaction.ability';

export const indexReactionsEventHandlerFn: EventHandlerFn<
  IndexReactionsRequest
> = async ({ ability, query }) => {
  await ability.authorize(IndexReactionsAbility);

  return getReactions(query);
};
