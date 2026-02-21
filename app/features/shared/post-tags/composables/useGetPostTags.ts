import type { PostTagFilters } from '~/features/shared/post-tags/post-tag.model';

import { getPostTags } from '~/features/shared/post-tags/post-tag.service';

export const useGetPostTags = (filters?: PostTagFilters) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getPostTags(filters ?? {});
    },
    queryKey: ['post-tags', filters],
  });
};
