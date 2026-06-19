import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { indexTagsEventHandlerFn } from '#server/features/tags/tag.index.handler';
import {
  IndexTagsQuerySchema,
  type IndexTagsRequest,
} from '#shared/features/tags';

export default defineEventHandler(
  new EventHandlerBuilder<IndexTagsRequest>()
    .query(IndexTagsQuerySchema)
    .handle(indexTagsEventHandlerFn)
);
