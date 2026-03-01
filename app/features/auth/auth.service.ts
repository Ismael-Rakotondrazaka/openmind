import type { UserMetadata } from './auth.model';

export const updateAuthUserMetadata = async (
  metadata: UserMetadata
): Promise<void> => {
  const client = useSupabaseClient();

  const { error } = await client.auth.updateUser({
    data: metadata,
  });

  if (error) throw error;
};

export const updateAuthUserEmail = async (
  email: string,
  emailRedirectTo?: string
): Promise<null | string> => {
  const client = useSupabaseClient();

  const { data, error } = await client.auth.updateUser(
    {
      email,
    },
    {
      emailRedirectTo,
    }
  );

  if (error) throw error;

  return data?.user?.id ?? null;
};

export const updateAuthUserPassword = async (
  password: string
): Promise<null | string> => {
  const client = useSupabaseClient();

  const { data, error } = await client.auth.updateUser({
    password,
  });

  if (error) throw error;

  return data?.user?.id ?? null;
};

export const getAuthClaims = async () => {
  const client = useSupabaseClient();

  const { data, error } = await client.auth.getClaims();

  if (error) throw error;

  return data?.claims ?? null;
};
