import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { updatePostEventHandlerFn } from '#server/features/posts/post.update.handler';
import {
  PostParamsSchema,
  UpdatePostBodySchema,
  type UpdatePostRequest,
} from '#shared/features/posts';

export default defineEventHandler(
  new EventHandlerBuilder<UpdatePostRequest>()
    .body(UpdatePostBodySchema)
    .params(PostParamsSchema)
    .handle(updatePostEventHandlerFn)
);
