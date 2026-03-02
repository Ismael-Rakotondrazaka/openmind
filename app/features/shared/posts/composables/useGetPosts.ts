import type { PostFilters } from '~/features/shared/posts/post.model';

import { getPosts } from '~/features/shared/posts/post.service';

export const useGetPosts = (filters: MaybeRefOrGetter<PostFilters> = {}) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getPosts(toValue(filters));
    },
    queryKey: ['posts', filters],
  });
};
