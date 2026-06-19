import type {
  IndexSavedPostsQuery,
  ToggleSavedPostBody,
} from '#shared/features/saved-posts';

import {
  defineMutation,
  defineQueryOptions,
  useQueryCache,
} from '@pinia/colada';

import type { WithFetchFn } from '~/utils/query';

import {
  getSavedPosts,
  isSavedPost,
  toggleSavedPost,
} from './saved-post.service';

export const SAVED_POST_QUERY_KEYS = {
  list: (filters: IndexSavedPostsQuery = {}) =>
    [...SAVED_POST_QUERY_KEYS.root, 'list', filters] as const,

  root: ['saved-posts'] as const,
};

export const savedPostListQuery = defineQueryOptions(
  ({ fetchFn, ...filters }: WithFetchFn<IndexSavedPostsQuery> = {}) => ({
    key: SAVED_POST_QUERY_KEYS.list(filters as IndexSavedPostsQuery),
    placeholderData: previousData => previousData,
    query: () => getSavedPosts(filters as IndexSavedPostsQuery, fetchFn),
  })
);

export const savedPostIsSavedQuery = defineQueryOptions(
  ({ fetchFn, postId }: WithFetchFn<{ postId?: string }> = {}) => ({
    enabled: Boolean(postId),
    initialData: () => false,
    key: [...SAVED_POST_QUERY_KEYS.root, 'isSaved', postId ?? ''] as const,
    query: async () => {
      if (!postId) return false;
      return isSavedPost({ postId }, fetchFn);
    },
  })
);

export const useToggleSavedPost = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ body }: { body: ToggleSavedPostBody }) =>
      toggleSavedPost(body),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: SAVED_POST_QUERY_KEYS.root });
    },
  };
});
