import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { showPostEventHandlerFn } from '#server/features/posts/post.show.handler';
import { PostParamsSchema, type ShowPostRequest } from '#shared/features/posts';

export default defineEventHandler(
  new EventHandlerBuilder<ShowPostRequest>()
    .params(PostParamsSchema)
    .handle(showPostEventHandlerFn)
);
