import type { PostFilters } from '~/features/shared/posts/post.model';

import { getPostsCount } from '~/features/shared/posts/post.service';

export const useGetPostsCount = (
  filters: MaybeRefOrGetter<PostFilters> = {}
) => {
  return useQuery({
    queryFn: async () => {
      return getPostsCount(toValue(filters));
    },
    queryKey: ['posts', 'count', filters],
  });
};
