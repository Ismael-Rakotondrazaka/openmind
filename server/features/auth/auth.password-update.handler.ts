import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { PasswordUpdateAuthRequest } from '#shared/features/auth';

export const passwordUpdateAuthEventHandlerFn: EventHandlerFn<
  PasswordUpdateAuthRequest
> = async ({ body, userSession }) => {
  const session = await userSession.require();
  const hashed = await hashPassword(body.password);

  await prisma.userIdentity.updateMany({
    data: { password: hashed },
    where: { provider: 'email', userId: session.user.id },
  });

  return { success: true };
};
