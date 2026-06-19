import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { passwordResetConfirmAuthEventHandlerFn } from '#server/features/auth/auth.password-reset-confirm.handler';
import {
  type PasswordResetConfirmAuthRequest,
  PasswordResetConfirmBodySchema,
} from '#shared/features/auth';

export default defineEventHandler(
  new EventHandlerBuilder<PasswordResetConfirmAuthRequest>()
    .body(PasswordResetConfirmBodySchema)
    .handle(passwordResetConfirmAuthEventHandlerFn)
);
