import type { InfiniteData } from '@tanstack/vue-query';

import type {
  Comment,
  CommentFilters,
} from '~/features/shared/comments/comment.model';
import type { PaginationResult } from '~/features/shared/paginations/pagination.model';

import { getComments } from '~/features/shared/comments/comment.service';

import { CommentConfig } from '../comment.config';

export const useGetComments = (
  filters: MaybeRefOrGetter<CommentFilters> = {}
) => {
  return useInfiniteQuery<
    PaginationResult<Comment>,
    Error,
    InfiniteData<PaginationResult<Comment>>,
    unknown[],
    string | undefined
  >({
    getNextPageParam: lastPage => {
      const limit = toValue(filters).limit ?? CommentConfig.PAGE_SIZE_DEFAULT;
      if (lastPage.data.length < limit) return undefined;
      return lastPage.data[lastPage.data.length - 1]?.created_at ?? undefined;
    },
    initialPageParam: undefined,
    placeholderData: keepPreviousData,
    queryFn: async ({ pageParam }) => {
      return getComments({
        ...toValue(filters),
        before: pageParam,
        sortOrder: SortOrder.desc,
      });
    },
    queryKey: ['comments', filters],
  });
};
