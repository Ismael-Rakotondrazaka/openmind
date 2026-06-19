import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { destroyPostEventHandlerFn } from '#server/features/posts/post.destroy.handler';
import {
  type DestroyPostRequest,
  PostParamsSchema,
} from '#shared/features/posts';

export default defineEventHandler(
  new EventHandlerBuilder<DestroyPostRequest>()
    .params(PostParamsSchema)
    .handle(destroyPostEventHandlerFn)
);
