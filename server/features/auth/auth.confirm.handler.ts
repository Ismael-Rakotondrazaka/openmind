import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { ConfirmAuthRequest } from '#shared/features/auth';

import { consumeEmailVerificationToken } from './auth.service';

export const confirmAuthEventHandlerFn: EventHandlerFn<
  ConfirmAuthRequest
> = async ({ query, userSession }) => {
  const userId = await consumeEmailVerificationToken(query.token);

  const user = await prisma.user.findUniqueOrThrow({
    select: {
      email: true,
      firstName: true,
      id: true,
      imageUrl: true,
      lastName: true,
      role: true,
      username: true,
    },
    where: { id: userId },
  });

  await userSession.replace({
    user: {
      email: user.email,
      firstName: user.firstName,
      id: user.id,
      imageUrl: user.imageUrl,
      lastName: user.lastName,
      role: user.role as 'admin' | 'moderator' | 'user',
      username: user.username,
    },
  });

  return { success: true };
};
