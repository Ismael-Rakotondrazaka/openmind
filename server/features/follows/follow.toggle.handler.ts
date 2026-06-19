import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { ToggleFollowRequest } from '#shared/features/follows';

import { ToggleFollowAbility } from '#shared/features/follows/follow.ability';

import { onFollowCreated } from './follow.side-effects';

export const toggleFollowEventHandlerFn: EventHandlerFn<
  ToggleFollowRequest
> = async ({ ability, body, userSession }) => {
  await ability.authorize(ToggleFollowAbility);

  const session = await userSession.require();
  const result = await toggleFollow(session.user.id, body);

  if (result.following && result.follow) {
    void onFollowCreated(result.follow);
  }

  return result;
};
