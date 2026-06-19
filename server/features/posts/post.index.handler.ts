import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { IndexPostsRequest } from '#shared/features/posts';

import { IndexPostsAbility } from '#shared/features/posts/post.ability';

export const indexPostsEventHandlerFn: EventHandlerFn<
  IndexPostsRequest
> = async ({ ability, query, userSession }) => {
  await ability.authorize(IndexPostsAbility);

  const session = await userSession.get();

  return getPosts(query, session.user?.id);
};
