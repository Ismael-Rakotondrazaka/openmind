import type {
  IndexUsersQuery,
  UpdateProfileBody,
} from '#shared/features/users';
import type { H3Event$Fetch } from 'nitropack/types';

export const getUsers = async (
  filters: IndexUsersQuery,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/users', {
    query: filters,
  });
};

export const getUser = async (
  userId: string,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  const { data } = await fetchFn(
    `/api/users/${userId}` as '/api/users/${userId}'
  );
  return data;
};

export const updateProfile = async (
  userId: string,
  body: UpdateProfileBody,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  const { data } = await fetchFn(
    `/api/users/${userId}` as '/api/users/${userId}',
    {
      body,
      method: 'PATCH',
    }
  );
  return data;
};

export const destroyUser = async (
  userId: string,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  await fetchFn(`/api/users/${userId}` as '/api/users/${userId}', {
    method: 'DELETE',
  });
};

export const isUsernameExists = async (
  { username }: { username: string },
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  const { exists } = await fetchFn('/api/users/exists' as const, {
    query: { username },
  });
  return exists;
};
