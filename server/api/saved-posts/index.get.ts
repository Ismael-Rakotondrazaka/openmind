import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { indexSavedPostsEventHandlerFn } from '#server/features/saved-posts/saved-post.index.handler';
import {
  IndexSavedPostsQuerySchema,
  type IndexSavedPostsRequest,
} from '#shared/features/saved-posts';

export default defineEventHandler(
  new EventHandlerBuilder<IndexSavedPostsRequest>()
    .query(IndexSavedPostsQuerySchema)
    .handle(indexSavedPostsEventHandlerFn)
);
