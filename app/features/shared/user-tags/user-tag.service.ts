import type { UserTagQuery } from '#shared/features/user-tags';
import type { H3Event$Fetch } from 'nitropack/types';

export const getUserTags = async (
  filters: UserTagQuery,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/user-tags', {
    query: filters,
  });
};

export const createUserTag = async (
  body: { tagId: string; userId: string },
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/user-tags', { body, method: 'POST' });
};

export const deleteUserTag = async (
  userId: string,
  tagId: string,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  await fetchFn(
    `/api/user-tags/${userId}/${tagId}` as `/api/user-tags/${string}/${string}`,
    { method: 'DELETE' }
  );
};
