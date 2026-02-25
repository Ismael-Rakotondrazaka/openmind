import type { PostTagFilters } from '~/features/shared/post-tags/post-tag.model';

import { getPostTagsCount } from '~/features/shared/post-tags/post-tag.service';

export const useGetPostTagsCount = (
  filters: MaybeRefOrGetter<PostTagFilters> = {}
) => {
  return useQuery({
    queryFn: async () => {
      return getPostTagsCount(toValue(filters));
    },
    queryKey: ['post-tags', 'count', filters],
  });
};
