import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { IndexCommentsRequest } from '#shared/features/comments';

import { IndexCommentsAbility } from '#shared/features/comments/comment.ability';

export const indexCommentsEventHandlerFn: EventHandlerFn<
  IndexCommentsRequest
> = async ({ ability, query }) => {
  await ability.authorize(IndexCommentsAbility);

  return getComments(query);
};
