import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../../../../shared/types/database.ts';

import { getEnv } from '../../utils/getEnv.ts';

export const createSupabaseClient = (token: string) => {
  return createClient<Database>(
    getEnv('NUXT_PUBLIC_SUPABASE_URL'),
    getEnv('SUPABASE_ANON_KEY'),
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    }
  );
};

/**
 * Crée un client Supabase admin avec SERVICE_ROLE_KEY pour bypasser RLS
 * Évite la récursion infinie causée par les politiques RLS qui vérifient les profils
 */
export const createSupabaseServiceClient = (): SupabaseClient<Database> => {
  return createClient<Database>(
    getEnv('NUXT_PUBLIC_SUPABASE_URL'),
    getEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
