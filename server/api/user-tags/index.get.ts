import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { indexUserTagsEventHandlerFn } from '#server/features/user-tags';
import {
  type IndexUserTagsRequest,
  UserTagQuerySchema,
} from '#shared/features/user-tags';

export default defineEventHandler(
  new EventHandlerBuilder<IndexUserTagsRequest>()
    .query(UserTagQuerySchema)
    .handle(indexUserTagsEventHandlerFn)
);
