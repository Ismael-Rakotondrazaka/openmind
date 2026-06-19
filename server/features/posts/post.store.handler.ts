import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { StorePostRequest } from '#shared/features/posts';

import { StorePostAbility } from '#shared/features/posts/post.ability';

export const storePostEventHandlerFn: EventHandlerFn<
  StorePostRequest
> = async ({ ability, body, userSession }) => {
  await ability.authorize(StorePostAbility);

  const session = await userSession.require();
  const post = await createPost(session.user.id, body);

  return { data: post };
};
