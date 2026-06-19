import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { publishPostEventHandlerFn } from '#server/features/posts/post.publish.handler';
import {
  PostParamsSchema,
  type PublishPostRequest,
} from '#shared/features/posts';

export default defineEventHandler(
  new EventHandlerBuilder<PublishPostRequest>()
    .params(PostParamsSchema)
    .handle(publishPostEventHandlerFn)
);
