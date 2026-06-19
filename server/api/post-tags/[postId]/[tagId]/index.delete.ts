import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { deletePostTagEventHandlerFn } from '#server/features/post-tags';
import {
  type DeletePostTagRequest,
  PostTagParamsSchema,
} from '#shared/features/post-tags';

export default defineEventHandler(
  new EventHandlerBuilder<DeletePostTagRequest>()
    .params(PostTagParamsSchema)
    .handle(deletePostTagEventHandlerFn)
);
