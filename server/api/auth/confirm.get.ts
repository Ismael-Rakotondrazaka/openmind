import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { confirmAuthEventHandlerFn } from '#server/features/auth/auth.confirm.handler';
import {
  type ConfirmAuthRequest,
  ConfirmQuerySchema,
} from '#shared/features/auth';

export default defineEventHandler(
  new EventHandlerBuilder<ConfirmAuthRequest>()
    .query(ConfirmQuerySchema)
    .handle(confirmAuthEventHandlerFn)
);
