import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { storeCommentEventHandlerFn } from '#server/features/comments/comment.store.handler';
import {
  CreateCommentBodySchema,
  type StoreCommentRequest,
} from '#shared/features/comments';

export default defineEventHandler(
  new EventHandlerBuilder<StoreCommentRequest>()
    .body(CreateCommentBodySchema)
    .handle(storeCommentEventHandlerFn)
);
