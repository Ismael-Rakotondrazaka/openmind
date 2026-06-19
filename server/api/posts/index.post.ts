import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { storePostEventHandlerFn } from '#server/features/posts/post.store.handler';
import {
  CreatePostBodySchema,
  type StorePostRequest,
} from '#shared/features/posts';

export default defineEventHandler(
  new EventHandlerBuilder<StorePostRequest>()
    .body(CreatePostBodySchema)
    .handle(storePostEventHandlerFn)
);
