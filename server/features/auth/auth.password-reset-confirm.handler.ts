import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { PasswordResetConfirmAuthRequest } from '#shared/features/auth';

import { consumePasswordResetToken } from './auth.service';

export const passwordResetConfirmAuthEventHandlerFn: EventHandlerFn<
  PasswordResetConfirmAuthRequest
> = async ({ body }) => {
  const userId = await consumePasswordResetToken(body.token);
  const hashed = await hashPassword(body.password);

  await prisma.userIdentity.updateMany({
    data: { password: hashed },
    where: { provider: 'email', userId },
  });

  return { success: true };
};
