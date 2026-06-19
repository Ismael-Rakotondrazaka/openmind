import type {
  IndexUsersQuery,
  UpdateProfileBody,
} from '#shared/features/users';

import {
  defineMutation,
  defineQueryOptions,
  useQueryCache,
} from '@pinia/colada';

import type { WithFetchFn } from '~/utils/query';

import { destroyUser, getUser, getUsers, updateProfile } from './user.service';

export const USER_QUERY_KEYS = {
  byId: (id: string) => [...USER_QUERY_KEYS.root, id] as const,

  list: (filters: IndexUsersQuery = {}) =>
    [...USER_QUERY_KEYS.root, 'list', filters] as const,

  root: ['users'] as const,
};

export const userListQuery = defineQueryOptions(
  ({ fetchFn, ...filters }: WithFetchFn<IndexUsersQuery> = {}) => ({
    key: USER_QUERY_KEYS.list(filters as IndexUsersQuery),
    placeholderData: previousData => previousData,
    query: () => getUsers(filters as IndexUsersQuery, fetchFn),
  })
);

export const userByIdQuery = defineQueryOptions(
  ({ fetchFn, id }: WithFetchFn<{ id: string }>) => ({
    key: USER_QUERY_KEYS.byId(id),
    query: () => getUser(id, fetchFn),
  })
);

export const useUpdateProfile = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ body, id }: { body: UpdateProfileBody; id: string }) =>
      updateProfile(id, body),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: USER_QUERY_KEYS.root });
    },
  };
});

export const useDestroyUser = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ id }: { id: string }) => destroyUser(id),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: USER_QUERY_KEYS.root });
    },
  };
});
