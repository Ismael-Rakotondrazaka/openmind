import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { createPostTagEventHandlerFn } from '#server/features/post-tags';
import {
  CreatePostTagBodySchema,
  type CreatePostTagRequest,
} from '#shared/features/post-tags';

export default defineEventHandler(
  new EventHandlerBuilder<CreatePostTagRequest>()
    .body(CreatePostTagBodySchema)
    .handle(createPostTagEventHandlerFn)
);
