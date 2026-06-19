import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { destroyCommentEventHandlerFn } from '#server/features/comments/comment.destroy.handler';
import {
  CommentParamsSchema,
  type DestroyCommentRequest,
} from '#shared/features/comments';

export default defineEventHandler(
  new EventHandlerBuilder<DestroyCommentRequest>()
    .params(CommentParamsSchema)
    .handle(destroyCommentEventHandlerFn)
);
