import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { UpdatePostRequest } from '#shared/features/posts';

import { UpdatePostAbility } from '#shared/features/posts/post.ability';

export const updatePostEventHandlerFn: EventHandlerFn<
  UpdatePostRequest
> = async ({ ability, body, params }) => {
  const post = await getPost(params.postId);

  if (post === null) {
    throw Exception.notFound({ data: {} });
  }

  await ability.authorize(UpdatePostAbility, post);

  const updated = await updatePost(params.postId, body);

  return { data: updated };
};
