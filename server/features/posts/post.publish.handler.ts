import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { PublishPostRequest } from '#shared/features/posts';

import { PublishPostAbility } from '#shared/features/posts/post.ability';

export const publishPostEventHandlerFn: EventHandlerFn<
  PublishPostRequest
> = async ({ ability, params }) => {
  const post = await getPost(params.postId);

  if (post === null) {
    throw Exception.notFound({ data: {} });
  }

  await ability.authorize(PublishPostAbility, post);

  const published = await publishPost(params.postId, post.authorId);

  return { data: published };
};
