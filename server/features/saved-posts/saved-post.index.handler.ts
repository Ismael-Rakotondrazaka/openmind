import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { IndexSavedPostsRequest } from '#shared/features/saved-posts';

import { IndexSavedPostsAbility } from '#shared/features/saved-posts/saved-post.ability';

export const indexSavedPostsEventHandlerFn: EventHandlerFn<
  IndexSavedPostsRequest
> = async ({ ability, query, userSession }) => {
  await ability.authorize(IndexSavedPostsAbility);

  const session = await userSession.require();

  return getSavedPosts(session.user.id, query);
};
