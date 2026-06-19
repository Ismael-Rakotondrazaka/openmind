import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { toggleSavedPostEventHandlerFn } from '#server/features/saved-posts/saved-post.toggle.handler';
import {
  ToggleSavedPostBodySchema,
  type ToggleSavedPostRequest,
} from '#shared/features/saved-posts';

export default defineEventHandler(
  new EventHandlerBuilder<ToggleSavedPostRequest>()
    .body(ToggleSavedPostBodySchema)
    .handle(toggleSavedPostEventHandlerFn)
);
