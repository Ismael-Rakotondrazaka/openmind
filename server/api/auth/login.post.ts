import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { loginAuthEventHandlerFn } from '#server/features/auth/auth.login.handler';
import { type LoginAuthRequest, LoginBodySchema } from '#shared/features/auth';

export default defineEventHandler(
  new EventHandlerBuilder<LoginAuthRequest>()
    .body(LoginBodySchema)
    .handle(loginAuthEventHandlerFn)
);
