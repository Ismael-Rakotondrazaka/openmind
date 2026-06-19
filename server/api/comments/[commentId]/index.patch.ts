import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { updateCommentEventHandlerFn } from '#server/features/comments/comment.update.handler';
import {
  CommentParamsSchema,
  UpdateCommentBodySchema,
  type UpdateCommentRequest,
} from '#shared/features/comments';

export default defineEventHandler(
  new EventHandlerBuilder<UpdateCommentRequest>()
    .body(UpdateCommentBodySchema)
    .params(CommentParamsSchema)
    .handle(updateCommentEventHandlerFn)
);
