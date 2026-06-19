import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { ShowPostRequest } from '#shared/features/posts';

import { ShowPostAbility } from '#shared/features/posts/post.ability';

export const showPostEventHandlerFn: EventHandlerFn<ShowPostRequest> = async ({
  ability,
  params,
  userSession,
}) => {
  await ability.authorize(ShowPostAbility);

  const post = await getPost(params.postId);

  if (post === null) {
    throw Exception.notFound({ data: {} });
  }

  if (post.status === 'draft') {
    const session = await userSession.get();
    if (session.user?.id !== post.authorId) {
      throw Exception.notFound({ data: {} });
    }
  }

  return { data: post };
};
