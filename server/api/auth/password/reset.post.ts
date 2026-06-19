import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { passwordResetAuthEventHandlerFn } from '#server/features/auth/auth.password-reset.handler';
import {
  type PasswordResetAuthRequest,
  PasswordResetBodySchema,
} from '#shared/features/auth';

export default defineEventHandler(
  new EventHandlerBuilder<PasswordResetAuthRequest>()
    .body(PasswordResetBodySchema)
    .handle(passwordResetAuthEventHandlerFn)
);
