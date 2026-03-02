import type { HonoRequest } from '@hono/hono';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../../../../shared/types/database.ts';
import type { AuthUser } from './authUser.ts';

import { createSupabaseClient } from '../supabase/client.ts';
import { getAuthUserFromClaims } from './authUser.ts';
import { getAuthToken } from './getAuthToken.ts';

export const isUserSBRequest = async (
  req: HonoRequest
): Promise<
  | {
      user: AuthUser;
      userSBClient: SupabaseClient<Database>;
    }
  | false
> => {
  const token = getAuthToken(req);
  if (!token) {
    return false;
  }

  const supabaseClient = createSupabaseClient(token);

  const { data, error } = await supabaseClient.auth.getClaims(token);

  if (error || !data) {
    return false;
  }

  const user = getAuthUserFromClaims(data.claims);

  return {
    user,
    userSBClient: supabaseClient,
  };
};
