import type {
  IndexReactionsQuery,
  ToggleReactionBody,
} from '#shared/features/reactions';

import {
  defineMutation,
  defineQueryOptions,
  useQueryCache,
} from '@pinia/colada';

import type { WithFetchFn } from '~/utils/query';

import { getReactions, toggleReaction } from './reaction.service';

export const REACTION_QUERY_KEYS = {
  byComment: (commentId: string) =>
    [...REACTION_QUERY_KEYS.root, 'comment', commentId] as const,
  byPost: (postId: string) =>
    [...REACTION_QUERY_KEYS.root, 'post', postId] as const,
  list: (filters: IndexReactionsQuery) => {
    if (filters.postId) {
      return [
        ...REACTION_QUERY_KEYS.byPost(filters.postId),
        'list',
        filters,
      ] as const;
    }
    if (filters.commentId) {
      return [
        ...REACTION_QUERY_KEYS.byComment(filters.commentId),
        'list',
        filters,
      ] as const;
    }
    return [...REACTION_QUERY_KEYS.root, 'list', filters] as const;
  },
  root: ['reactions'] as const,
};

export const reactionsQuery = defineQueryOptions(
  ({ fetchFn, ...filters }: WithFetchFn<IndexReactionsQuery>) => ({
    key: REACTION_QUERY_KEYS.list(filters as IndexReactionsQuery),
    query: () => getReactions(filters as IndexReactionsQuery, fetchFn),
  })
);

export const useToggleReaction = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ body }: { body: ToggleReactionBody }) => toggleReaction(body),
    onSuccess: (_data: unknown, { body }: { body: ToggleReactionBody }) => {
      if ('postId' in body && body.postId) {
        queryCache.invalidateQueries({
          key: REACTION_QUERY_KEYS.byPost(body.postId),
        });
      } else if ('commentId' in body && body.commentId) {
        queryCache.invalidateQueries({
          key: REACTION_QUERY_KEYS.byComment(body.commentId),
        });
      } else {
        queryCache.invalidateQueries({ key: REACTION_QUERY_KEYS.root });
      }
    },
  };
});
