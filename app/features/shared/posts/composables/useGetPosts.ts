import type { PostFilters } from '~/features/shared/posts/post.model';

import { getPosts } from '~/features/shared/posts/post.service';

export const useGetPosts = (filters?: PostFilters) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getPosts(filters ?? {});
    },
    queryKey: ['posts', filters],
  });
};
