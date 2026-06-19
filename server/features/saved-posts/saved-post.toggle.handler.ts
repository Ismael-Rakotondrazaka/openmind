import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { ToggleSavedPostRequest } from '#shared/features/saved-posts';

import { ToggleSavedPostAbility } from '#shared/features/saved-posts/saved-post.ability';

export const toggleSavedPostEventHandlerFn: EventHandlerFn<
  ToggleSavedPostRequest
> = async ({ ability, body, userSession }) => {
  await ability.authorize(ToggleSavedPostAbility);

  const session = await userSession.require();

  return toggleSavedPost(session.user.id, body);
};
