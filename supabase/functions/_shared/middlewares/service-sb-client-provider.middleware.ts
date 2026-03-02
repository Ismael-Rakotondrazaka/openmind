import type { SupabaseClient } from '@supabase/supabase-js';

import { createMiddleware } from '@hono/hono/factory';

import type { Database } from '../../../../shared/types/database.ts';

import { createSupabaseServiceClient } from '../services/supabase/client.ts';

export interface ServiceSBClientProviderContextVariables {
  serviceSBClient: SupabaseClient<Database>;
}

export const serviceSBClientProviderMiddleware = createMiddleware<{
  Variables: ServiceSBClientProviderContextVariables;
}>(async (context, next) => {
  // Skip authentication for OPTIONS requests (CORS preflight)
  if (context.req.method === 'OPTIONS') {
    await next();
    return;
  }

  context.set('serviceSBClient', createSupabaseServiceClient());

  await next();
});
