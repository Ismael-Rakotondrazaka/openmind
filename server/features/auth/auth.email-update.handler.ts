import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { EmailUpdateAuthRequest } from '#shared/features/auth';

import { onEmailVerificationRequested } from './auth.side-effects';

export const emailUpdateAuthEventHandlerFn: EventHandlerFn<
  EmailUpdateAuthRequest
> = async ({ body, locale, userSession }) => {
  const session = await userSession.require();

  const existing = await prisma.user.count({ where: { email: body.email } });
  if (existing > 0) {
    throw Exception.badRequest({
      data: {},
      message: 'auth.settings.email.errors.alreadyTaken',
    });
  }

  await onEmailVerificationRequested(
    session.user.id,
    body.email,
    { pendingEmail: body.email, type: 'email_change' },
    locale
  );

  // Session is intentionally left active here; the client calls POST /api/auth/logout after success
  return { success: true };
};
