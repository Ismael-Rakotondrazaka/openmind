import type { PostTagFilters } from '~/features/shared/post-tags/post-tag.model';

import { getPostTags } from '~/features/shared/post-tags/post-tag.service';

export const useGetPostTags = (
  filters: MaybeRefOrGetter<PostTagFilters> = {}
) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getPostTags(toValue(filters));
    },
    queryKey: ['post-tags', filters],
  });
};
