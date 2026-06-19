import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { ConfirmResendAuthRequest } from '#shared/features/auth';

import { getAuthUserByEmail } from './auth.service';
import { onEmailVerificationRequested } from './auth.side-effects';

export const confirmResendAuthEventHandlerFn: EventHandlerFn<
  ConfirmResendAuthRequest
> = async ({ body, locale }) => {
  const user = await getAuthUserByEmail(body.email);

  if (user && !user.emailVerifiedAt) {
    await onEmailVerificationRequested(user.id, user.email, {}, locale);
  }

  return { success: true };
};
