import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { destroyTagEventHandlerFn } from '#server/features/tags/tag.destroy.handler';
import { type DestroyTagRequest, TagParamsSchema } from '#shared/features/tags';

export default defineEventHandler(
  new EventHandlerBuilder<DestroyTagRequest>()
    .params(TagParamsSchema)
    .handle(destroyTagEventHandlerFn)
);
