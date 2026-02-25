import type { CommentFilters } from '~/features/shared/comments/comment.model';

import { getCommentsCount } from '~/features/shared/comments/comment.service';

export const useGetCommentsCount = (
  filters: MaybeRefOrGetter<CommentFilters> = {}
) => {
  return useQuery({
    queryFn: async () => {
      return getCommentsCount(toValue(filters));
    },
    queryKey: ['comments', 'count', filters],
  });
};
