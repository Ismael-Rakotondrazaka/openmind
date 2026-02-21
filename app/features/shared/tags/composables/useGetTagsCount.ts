import type { TagFilters } from '~/features/shared/tags/tag.model';

import { getTagsCount } from '~/features/shared/tags/tag.service';

export const useGetTagsCount = (filters?: TagFilters) => {
  return useQuery({
    queryFn: async () => {
      return getTagsCount(filters ?? {});
    },
    queryKey: ['tags', 'count', filters],
  });
};
