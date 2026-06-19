import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { DestroyCommentRequest } from '#shared/features/comments';

import { wsRegistry } from '#server/utils/ws-registry';
import {
  commentsTopic,
  DestroyCommentAbility,
  WsCommentMessageType,
} from '#shared/features/comments';
import { WsEvent } from '#shared/utils/ws';

export const destroyCommentEventHandlerFn: EventHandlerFn<
  DestroyCommentRequest
> = async ({ ability, params }) => {
  const comment = await getComment(params.commentId);

  if (comment === null) {
    throw Exception.notFound({ data: {} });
  }

  await ability.authorize(DestroyCommentAbility, comment);
  await deleteComment(params.commentId, comment.postId);
  wsRegistry.broadcast(commentsTopic(comment.postId), {
    event: WsEvent.DELETE,
    record: comment,
    type: WsCommentMessageType,
  });

  return { data: comment };
};
