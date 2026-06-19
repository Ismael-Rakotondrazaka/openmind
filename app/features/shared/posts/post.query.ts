import type {
  CreatePostBody,
  IndexPostsQuery,
  UpdatePostBody,
} from '#shared/features/posts';

import {
  defineMutation,
  defineQueryOptions,
  useQueryCache,
} from '@pinia/colada';

import type { WithFetchFn } from '~/utils/query';

import {
  destroyPost,
  getPost,
  getPosts,
  publishPost,
  storePost,
  updatePost,
} from './post.service';

export const POST_QUERY_KEYS = {
  bySlug: (slug: string) => [...POST_QUERY_KEYS.root, slug] as const,

  list: (filters: IndexPostsQuery = {}) =>
    [...POST_QUERY_KEYS.root, 'list', filters] as const,

  root: ['posts'] as const,
};

export const postListQuery = defineQueryOptions(
  ({ fetchFn, ...filters }: WithFetchFn<IndexPostsQuery> = {}) => ({
    key: POST_QUERY_KEYS.list(filters as IndexPostsQuery),
    placeholderData: previousData => previousData,
    query: () => getPosts(filters as IndexPostsQuery, fetchFn),
  })
);

export const postByIdQuery = defineQueryOptions(
  ({ fetchFn, id }: WithFetchFn<{ id: string }>) => ({
    enabled: Boolean(id),
    key: POST_QUERY_KEYS.bySlug(id),
    query: () => getPost(id, fetchFn),
  })
);

export const useStorePost = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ body }: { body: CreatePostBody }) => storePost(body),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: POST_QUERY_KEYS.root });
    },
  };
});

export const useUpdatePost = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ body, id }: { body: UpdatePostBody; id: string }) =>
      updatePost(id, body),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: POST_QUERY_KEYS.root });
    },
  };
});

export const usePublishPost = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ id }: { id: string }) => publishPost(id),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: POST_QUERY_KEYS.root });
    },
  };
});

export const useDestroyPost = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ id }: { id: string }) => destroyPost(id),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: POST_QUERY_KEYS.root });
    },
  };
});
