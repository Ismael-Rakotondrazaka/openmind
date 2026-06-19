import type { PostTagQuery } from '#shared/features/post-tags';

import {
  defineMutation,
  defineQueryOptions,
  useQueryCache,
} from '@pinia/colada';

import type { WithFetchFn } from '~/utils/query';

import { createPostTag, deletePostTag, getPostTags } from './post-tag.service';

export const POST_TAG_QUERY_KEYS = {
  list: (filters: PostTagQuery = {}) =>
    [...POST_TAG_QUERY_KEYS.root, 'list', filters] as const,

  root: ['post-tags'] as const,
};

export const postTagListQuery = defineQueryOptions(
  ({ fetchFn, ...filters }: WithFetchFn<PostTagQuery> = {}) => ({
    key: POST_TAG_QUERY_KEYS.list(filters as PostTagQuery),
    placeholderData: previousData => previousData,
    query: () => getPostTags(filters as PostTagQuery, fetchFn),
  })
);

export const useStorePostTag = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ body }: { body: { postId: string; tagId: string } }) =>
      createPostTag(body),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: POST_TAG_QUERY_KEYS.root });
    },
  };
});

export const useDestroyPostTag = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ postId, tagId }: { postId: string; tagId: string }) =>
      deletePostTag(postId, tagId),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: POST_TAG_QUERY_KEYS.root });
    },
  };
});
