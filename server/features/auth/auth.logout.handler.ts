import type { EventHandler } from 'h3';

export const authLogoutHandler: EventHandler = async event => {
  await clearUserSession(event);

  return { success: true };
};
