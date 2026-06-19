import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { indexPostsEventHandlerFn } from '#server/features/posts/post.index.handler';
import {
  IndexPostsQuerySchema,
  type IndexPostsRequest,
} from '#shared/features/posts';

export default defineEventHandler(
  new EventHandlerBuilder<IndexPostsRequest>()
    .query(IndexPostsQuerySchema)
    .handle(indexPostsEventHandlerFn)
);
