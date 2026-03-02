import type {
  GoTrueClient,
  UserAppMetadata,
  UserMetadata,
} from '@supabase/supabase-js';

export interface AuthUser {
  app_metadata?: UserAppMetadata;
  email?: string;
  id: string;
  is_anonymous?: boolean;
  phone?: string;
  role: string;
  user_metadata?: UserMetadata;
}

export const getAuthUserFromClaims = (
  claims: Exclude<
    Awaited<ReturnType<GoTrueClient['getClaims']>>['data'],
    null
  >['claims']
): AuthUser => {
  return {
    app_metadata: claims.app_metadata,
    email: claims.email,
    id: claims.sub,
    is_anonymous: claims.is_anonymous,
    phone: claims.phone,
    role: claims.role,
    user_metadata: claims.user_metadata,
  };
};
