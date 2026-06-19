import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { toggleFollowEventHandlerFn } from '#server/features/follows/follow.toggle.handler';
import {
  ToggleFollowBodySchema,
  type ToggleFollowRequest,
} from '#shared/features/follows';

export default defineEventHandler(
  new EventHandlerBuilder<ToggleFollowRequest>()
    .body(ToggleFollowBodySchema)
    .handle(toggleFollowEventHandlerFn)
);
