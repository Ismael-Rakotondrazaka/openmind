import type { SupabaseClient } from '@supabase/supabase-js';

import { createMiddleware } from '@hono/hono/factory';

import type { Database } from '../../../../shared/types/database.ts';
import type { AuthUser } from '../services/auth/authUser.ts';

import { isUserSBRequest } from '../services/auth/isUserSBRequest.ts';
import { apiResponse } from '../utils/responses.ts';

export interface UserSBContextVariables {
  user: AuthUser;
  userSBClient: SupabaseClient<Database>;
}

export const userSBMiddleware = createMiddleware(async (context, next) => {
  // Skip authentication for OPTIONS requests (CORS preflight)
  if (context.req.method === 'OPTIONS') {
    await next();
    return;
  }

  const result = await isUserSBRequest(context.req);

  if (result === false) {
    return apiResponse.unauthorized();
  }

  context.set('userSBClient', result.userSBClient);
  context.set('user', result.user);

  await next();
});
