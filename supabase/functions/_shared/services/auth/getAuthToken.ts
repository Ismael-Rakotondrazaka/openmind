import type { HonoRequest } from '@hono/hono';

/**
 * Get the authentication token from the request headers.
 *
 * 1. Supabase js WILL inject an `Apikey` header to the request if `Authorization` header IS present
 * 2. Infrastructure layer of supabase edge function WILL inject `Authorization` header if `Apikey` header IS present
 * 3. Infrastructure layer of supabase edge function WILL NOT inject `Apikey` header if `Authorization` header IS present
 *
 * Conclusion:
 * 1. Use ONLY `Authorization: Bearer <anon_key|service_role_key>` header to authenticate the request
 * OR
 * - Use ONLY `Apikey: <publishable_key|secret_key>` header to authenticate the request
 * OR
 * - Use BOTH `Authorization: Bearer <anon_key|service_role_key>` AND `Apikey: <publishable_key|secret_key>` headers to authenticate the request, but make sure the values are correct, not mixed up
 *
 * 2. Only use `Authorization: Bearer <anon_key|service_role_key>` to check if the request is made by an authenticated user
 */
export const getAuthToken = (req: HonoRequest): null | string => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return null;
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return null;
  }

  return token;
};
