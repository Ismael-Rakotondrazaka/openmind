import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { UpdateCommentRequest } from '#shared/features/comments';

import { wsRegistry } from '#server/utils/ws-registry';
import {
  commentsTopic,
  UpdateCommentAbility,
  WsCommentMessageType,
} from '#shared/features/comments';
import { WsEvent } from '#shared/utils/ws';

export const updateCommentEventHandlerFn: EventHandlerFn<
  UpdateCommentRequest
> = async ({ ability, body, params }) => {
  const comment = await getComment(params.commentId);

  if (comment === null) {
    throw Exception.notFound({ data: {} });
  }

  await ability.authorize(UpdateCommentAbility, comment);

  const updated = await updateComment(params.commentId, body);
  wsRegistry.broadcast(commentsTopic(comment.postId), {
    event: WsEvent.UPDATE,
    record: updated,
    type: WsCommentMessageType,
  });

  return { data: updated };
};
