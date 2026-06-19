import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { storeTagEventHandlerFn } from '#server/features/tags/tag.store.handler';
import {
  CreateTagBodySchema,
  type StoreTagRequest,
} from '#shared/features/tags';

export default defineEventHandler(
  new EventHandlerBuilder<StoreTagRequest>()
    .body(CreateTagBodySchema)
    .handle(storeTagEventHandlerFn)
);
