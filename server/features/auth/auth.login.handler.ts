import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { LoginAuthRequest } from '#shared/features/auth';

import { getAuthUserByEmail } from './auth.service';

export const loginAuthEventHandlerFn: EventHandlerFn<
  LoginAuthRequest
> = async ({ body, userSession }) => {
  const user = await getAuthUserByEmail(body.email);
  const identity = user?.identities[0];

  const credentialsErrorKey = 'auth.signIn.form.errors.credentials.notMatch';

  if (!user || !identity?.password) {
    throw Exception.unauthorized({
      data: {},
      message: credentialsErrorKey,
    });
  }

  if (!user.emailVerifiedAt) {
    throw Exception.forbidden({
      data: {},
      message: 'auth.signIn.form.errors.emailNotVerified',
    });
  }

  const valid = await verifyPassword(identity.password, body.password);

  if (!valid) {
    throw Exception.unauthorized({
      data: {},
      message: credentialsErrorKey,
    });
  }

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
