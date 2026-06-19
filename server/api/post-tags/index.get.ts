import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { indexPostTagsEventHandlerFn } from '#server/features/post-tags';
import {
  type IndexPostTagsRequest,
  PostTagQuerySchema,
} from '#shared/features/post-tags';

export default defineEventHandler(
  new EventHandlerBuilder<IndexPostTagsRequest>()
    .query(PostTagQuerySchema)
    .handle(indexPostTagsEventHandlerFn)
);
