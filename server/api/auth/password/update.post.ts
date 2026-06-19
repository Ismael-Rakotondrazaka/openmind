import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { passwordUpdateAuthEventHandlerFn } from '#server/features/auth/auth.password-update.handler';
import {
  type PasswordUpdateAuthRequest,
  PasswordUpdateBodySchema,
} from '#shared/features/auth';

export default defineEventHandler(
  new EventHandlerBuilder<PasswordUpdateAuthRequest>()
    .body(PasswordUpdateBodySchema)
    .handle(passwordUpdateAuthEventHandlerFn)
);
