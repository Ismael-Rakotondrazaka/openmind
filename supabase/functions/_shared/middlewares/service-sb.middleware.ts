import { createMiddleware } from '@hono/hono/factory';

import { isServiceSBRequest } from '../services/auth/isServiceSBRequest.ts';
import { apiResponse } from '../utils/responses.ts';

export type ServiceSBContextVariables = Record<string, never>;

export const serviceSBMiddleware = createMiddleware<{
  Variables: ServiceSBContextVariables;
}>(async (context, next) => {
  // Skip authentication for OPTIONS requests (CORS preflight)
  if (context.req.method === 'OPTIONS') {
    await next();
    return;
  }

  const result = isServiceSBRequest(context.req);

  if (result === false) {
    return apiResponse.unauthorized();
  }

  await next();
});
