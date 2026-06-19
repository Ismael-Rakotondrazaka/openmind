import type {
  CreateCommentBody,
  IndexCommentsQuery,
  UpdateCommentBody,
} from '#shared/features/comments';

import {
  defineMutation,
  defineQueryOptions,
  useQueryCache,
} from '@pinia/colada';

import type { WithFetchFn } from '~/utils/query';

import {
  destroyComment,
  getComments,
  storeComment,
  updateComment,
} from './comment.service';

export const COMMENT_QUERY_KEYS = {
  list: (filters: IndexCommentsQuery) =>
    [...COMMENT_QUERY_KEYS.root, 'list', filters] as const,

  root: ['comments'] as const,
};

export const commentListQuery = defineQueryOptions(
  ({ fetchFn, ...filters }: WithFetchFn<IndexCommentsQuery>) => ({
    key: COMMENT_QUERY_KEYS.list(filters as IndexCommentsQuery),
    placeholderData: previousData => previousData,
    query: () => getComments(filters as IndexCommentsQuery, fetchFn),
  })
);

export const useStoreComment = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ body }: { body: CreateCommentBody }) => storeComment(body),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: COMMENT_QUERY_KEYS.root });
    },
  };
});

export const useUpdateComment = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ body, id }: { body: UpdateCommentBody; id: string }) =>
      updateComment(id, body),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: COMMENT_QUERY_KEYS.root });
    },
  };
});

export const useDestroyComment = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ id }: { id: string }) => destroyComment(id),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: COMMENT_QUERY_KEYS.root });
    },
  };
});
