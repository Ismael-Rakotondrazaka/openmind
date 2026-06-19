import type { CreateTagBody, IndexTagsQuery } from '#shared/features/tags';

import {
  defineMutation,
  defineQueryOptions,
  useQueryCache,
} from '@pinia/colada';

import type { WithFetchFn } from '~/utils/query';

import { destroyTag, getTags, storeTag } from './tag.service';

export const TAG_QUERY_KEYS = {
  list: (filters: IndexTagsQuery = {}) =>
    [...TAG_QUERY_KEYS.root, 'list', filters] as const,

  root: ['tags'] as const,
};

export const tagListQuery = defineQueryOptions(
  ({ fetchFn, ...filters }: WithFetchFn<IndexTagsQuery> = {}) => ({
    key: TAG_QUERY_KEYS.list(filters as IndexTagsQuery),
    placeholderData: previousData => previousData,
    query: () => getTags(filters as IndexTagsQuery, fetchFn),
  })
);

export const useStoreTag = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ body }: { body: CreateTagBody }) => storeTag(body),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: TAG_QUERY_KEYS.root });
    },
  };
});

export const useDestroyTag = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ id }: { id: string }) => destroyTag(id),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: TAG_QUERY_KEYS.root });
    },
  };
});
