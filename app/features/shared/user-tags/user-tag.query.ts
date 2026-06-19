import type { UserTagQuery } from '#shared/features/user-tags';

import {
  defineMutation,
  defineQueryOptions,
  useQueryCache,
} from '@pinia/colada';

import type { WithFetchFn } from '~/utils/query';

import { createUserTag, deleteUserTag, getUserTags } from './user-tag.service';

export const USER_TAG_QUERY_KEYS = {
  list: (filters: UserTagQuery = {}) =>
    [...USER_TAG_QUERY_KEYS.root, 'list', filters] as const,

  root: ['user-tags'] as const,
};

export const userTagListQuery = defineQueryOptions(
  ({ fetchFn, ...filters }: WithFetchFn<UserTagQuery> = {}) => ({
    key: USER_TAG_QUERY_KEYS.list(filters as UserTagQuery),
    placeholderData: previousData => previousData,
    query: () => getUserTags(filters as UserTagQuery, fetchFn),
  })
);

export const useStoreUserTag = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ body }: { body: { tagId: string; userId: string } }) =>
      createUserTag(body),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: USER_TAG_QUERY_KEYS.root });
    },
  };
});

export const useDestroyUserTag = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ tagId, userId }: { tagId: string; userId: string }) =>
      deleteUserTag(userId, tagId),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: USER_TAG_QUERY_KEYS.root });
    },
  };
});
