import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { indexCommentsEventHandlerFn } from '#server/features/comments/comment.index.handler';
import {
  IndexCommentsQuerySchema,
  type IndexCommentsRequest,
} from '#shared/features/comments';

export default defineEventHandler(
  new EventHandlerBuilder<IndexCommentsRequest>()
    .query(IndexCommentsQuerySchema)
    .handle(indexCommentsEventHandlerFn)
);
