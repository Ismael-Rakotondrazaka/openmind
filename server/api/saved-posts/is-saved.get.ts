import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { isSavedPostEventHandlerFn } from '#server/features/saved-posts/saved-post.is-saved.handler';
import {
  IsSavedPostQuerySchema,
  type IsSavedPostRequest,
} from '#shared/features/saved-posts';

export default defineEventHandler(
  new EventHandlerBuilder<IsSavedPostRequest>()
    .query(IsSavedPostQuerySchema)
    .handle(isSavedPostEventHandlerFn)
);
