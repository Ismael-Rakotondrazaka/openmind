import type { CommentFilters } from '~/features/shared/comments/comment.model';

import { getComments } from '~/features/shared/comments/comment.service';

export const useGetComments = (
  filters: MaybeRefOrGetter<CommentFilters> = {}
) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getComments(toValue(filters));
    },
    queryKey: ['comments', filters],
  });
};
