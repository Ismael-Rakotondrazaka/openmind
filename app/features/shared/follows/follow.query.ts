import type {
  IndexFollowsQuery,
  ToggleFollowBody,
} from '#shared/features/follows';

import {
  defineMutation,
  defineQueryOptions,
  useQueryCache,
} from '@pinia/colada';

import type { WithFetchFn } from '~/utils/query';

import { getFollows, toggleFollow } from './follow.service';

export const FOLLOW_QUERY_KEYS = {
  byRelationship: (followerId: string, followingId: string) =>
    [...FOLLOW_QUERY_KEYS.root, 'rel', followerId, followingId] as const,

  list: (filters: IndexFollowsQuery = {}) =>
    [...FOLLOW_QUERY_KEYS.root, 'list', filters] as const,

  root: ['follows'] as const,
};

export const followListQuery = defineQueryOptions(
  ({ fetchFn, ...filters }: WithFetchFn<IndexFollowsQuery> = {}) => ({
    key: FOLLOW_QUERY_KEYS.list(filters as IndexFollowsQuery),
    placeholderData: previousData => previousData,
    query: () => getFollows(filters as IndexFollowsQuery, fetchFn),
  })
);

export const followByRelationshipQuery = defineQueryOptions(
  ({
    fetchFn,
    followerId,
    followingId,
  }: WithFetchFn<{ followerId?: string; followingId?: string }>) => ({
    enabled: Boolean(followerId && followingId && followerId !== followingId),
    key: FOLLOW_QUERY_KEYS.byRelationship(followerId ?? '', followingId ?? ''),
    query: () => getFollows({ followerId, followingId, pageSize: 1 }, fetchFn),
  })
);

export const useToggleFollow = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ body }: { body: ToggleFollowBody }) => toggleFollow(body),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: FOLLOW_QUERY_KEYS.root });
    },
  };
});
