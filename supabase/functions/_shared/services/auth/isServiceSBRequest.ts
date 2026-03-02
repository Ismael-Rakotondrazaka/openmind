import type { HonoRequest } from '@hono/hono';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../../../../shared/types/database.ts';

import { compareToken } from '../../utils/compareToken.ts';
import { getEnv } from '../../utils/getEnv.ts';
import { createSupabaseServiceClient } from '../supabase/client.ts';
import { getApiKey } from './getApiKey.ts';

export const isServiceSBRequest = (
  req: HonoRequest
):
  | {
      serviceSBClient: SupabaseClient<Database>;
    }
  | false => {
  const token = getApiKey(req);

  if (!token) {
    return false;
  }

  /*
    In Production, especially for new projects
    - SUPABASE_SERVICE_ROLE_KEY value is the supabase secret key
    - SUPABASE_ANON_KEY value is the supabase publishable key

    ! which is very weird as they are set automatically by supabase, and cannot be changed.

    And in Development,
    - SUPABASE_SERVICE_ROLE_KEY value is the supabase service role key
    - SUPABASE_ANON_KEY value is the supabase anon key
  */
  const expectedToken = getEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!compareToken(token, expectedToken)) {
    return false;
  }

  return {
    serviceSBClient: createSupabaseServiceClient(),
  };
};
