import type { PostFilters } from '~/features/shared/posts/post.model';

import { getPostsCount } from '~/features/shared/posts/post.service';

export const useGetPostsCount = (filters?: PostFilters) => {
  return useQuery({
    queryFn: async () => {
      return getPostsCount(filters ?? {});
    },
    queryKey: ['posts', 'count', filters],
  });
};
