import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { emailUpdateAuthEventHandlerFn } from '#server/features/auth/auth.email-update.handler';
import {
  type EmailUpdateAuthRequest,
  EmailUpdateBodySchema,
} from '#shared/features/auth';

export default defineEventHandler(
  new EventHandlerBuilder<EmailUpdateAuthRequest>()
    .body(EmailUpdateBodySchema)
    .handle(emailUpdateAuthEventHandlerFn)
);
