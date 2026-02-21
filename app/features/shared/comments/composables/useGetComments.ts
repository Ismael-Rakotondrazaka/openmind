import type { CommentFilters } from '~/features/shared/comments/comment.model';

import { getComments } from '~/features/shared/comments/comment.service';

export const useGetComments = (filters?: CommentFilters) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getComments(filters ?? {});
    },
    queryKey: ['comments', filters],
  });
};
