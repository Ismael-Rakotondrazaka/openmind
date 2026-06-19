import type { EventHandlerFn } from '#server/core/requests/requestToEventHandler';
import type { RegisterAuthRequest } from '#shared/features/auth';

import { registerUser } from './auth.service';
import { onUserRegistered } from './auth.side-effects';

export const registerAuthEventHandlerFn: EventHandlerFn<
  RegisterAuthRequest
> = async ({ body, locale }) => {
  const user = await registerUser(body);

  await onUserRegistered(user.id, user.email, locale);

  return { success: true };
};
