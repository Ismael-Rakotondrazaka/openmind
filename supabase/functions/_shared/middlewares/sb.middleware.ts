import { createMiddleware } from '@hono/hono/factory';

import type { UserSBContextVariables } from './user-sb.middleware.ts';

import { isServiceSBRequest } from '../services/auth/isServiceSBRequest.ts';
import { isUserSBRequest } from '../services/auth/isUserSBRequest.ts';
import { apiResponse } from '../utils/responses.ts';

export type SBContextVariables = ServiceVariables | UserVariables;

export interface ServiceVariables {
  sbType: 'service';
}

export interface UserVariables extends UserSBContextVariables {
  sbType: 'user';
}

export const sbMiddleware = createMiddleware<{
  Variables: SBContextVariables;
}>(async (context, next) => {
  // Skip authentication for OPTIONS requests (CORS preflight)
  if (context.req.method === 'OPTIONS') {
    await next();
    return;
  }

  const serviceSBResult = isServiceSBRequest(context.req);

  if (serviceSBResult !== false) {
    context.set('sbType', 'service');
    await next();
    return;
  }

  const result = await isUserSBRequest(context.req);

  if (result !== false) {
    context.set('sbType', 'user');
    // @ts-expect-error - this is a valid assignment
    context.set('userSBClient', result.userSBClient);
    // @ts-expect-error - this is a valid assignment
    context.set('user', result.user);
    await next();
    return;
  }

  return apiResponse.unauthorized();
});
