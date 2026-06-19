import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { DestroyPostRequest } from '#shared/features/posts';

import { DestroyPostAbility } from '#shared/features/posts/post.ability';

export const destroyPostEventHandlerFn: EventHandlerFn<
  DestroyPostRequest
> = async ({ ability, params }) => {
  const post = await getPost(params.postId);

  if (post === null) {
    throw Exception.notFound({ data: {} });
  }

  await ability.authorize(DestroyPostAbility, post);
  await deletePost(params.postId, post.authorId, post.status === 'published');

  return { data: post };
};
