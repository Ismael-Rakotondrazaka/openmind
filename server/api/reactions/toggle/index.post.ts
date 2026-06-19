import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { toggleReactionEventHandlerFn } from '#server/features/reactions/reaction.toggle.handler';
import {
  ToggleReactionBodySchema,
  type ToggleReactionRequest,
} from '#shared/features/reactions';

export default defineEventHandler(
  new EventHandlerBuilder<ToggleReactionRequest>()
    .body(ToggleReactionBodySchema)
    .handle(toggleReactionEventHandlerFn)
);
