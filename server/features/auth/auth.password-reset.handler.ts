import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { PasswordResetAuthRequest } from '#shared/features/auth';

import { onPasswordResetRequested } from './auth.side-effects';

export const passwordResetAuthEventHandlerFn: EventHandlerFn<
  PasswordResetAuthRequest
> = async ({ body, locale }) => {
  await onPasswordResetRequested(body.email, locale);

  return { success: true };
};
