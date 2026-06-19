import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { StoreCommentRequest } from '#shared/features/comments';

import { StoreCommentAbility } from '#shared/features/comments';

import { onCommentCreated } from './comment.side-effects';

export const storeCommentEventHandlerFn: EventHandlerFn<
  StoreCommentRequest
> = async ({ ability, body, userSession }) => {
  await ability.authorize(StoreCommentAbility);

  const session = await userSession.require();
  const comment = await createComment(session.user.id, body);

  void onCommentCreated(comment);

  return { data: comment };
};
