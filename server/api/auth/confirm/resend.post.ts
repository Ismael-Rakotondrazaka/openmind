import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { confirmResendAuthEventHandlerFn } from '#server/features/auth/auth.confirm-resend.handler';
import {
  type ConfirmResendAuthRequest,
  ConfirmResendBodySchema,
} from '#shared/features/auth';

export default defineEventHandler(
  new EventHandlerBuilder<ConfirmResendAuthRequest>()
    .body(ConfirmResendBodySchema)
    .handle(confirmResendAuthEventHandlerFn)
);
