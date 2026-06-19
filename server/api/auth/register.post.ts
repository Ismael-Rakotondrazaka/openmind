import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { registerAuthEventHandlerFn } from '#server/features/auth/auth.register.handler';
import {
  type RegisterAuthRequest,
  RegisterBodySchema,
} from '#shared/features/auth';

export default defineEventHandler(
  new EventHandlerBuilder<RegisterAuthRequest>()
    .body(RegisterBodySchema)
    .handle(registerAuthEventHandlerFn)
);
