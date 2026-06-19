import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { IsSavedPostRequest } from '#shared/features/saved-posts';

import { IsSavedPostAbility } from '#shared/features/saved-posts/saved-post.ability';

export const isSavedPostEventHandlerFn: EventHandlerFn<
  IsSavedPostRequest
> = async ({ ability, query, userSession }) => {
  await ability.authorize(IsSavedPostAbility);

  const session = await userSession.require();

  const isSaved = await checkIsSavedPost(session.user.id, query.postId);
  return { isSaved };
};
