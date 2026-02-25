import type { TagFilters } from '~/features/shared/tags/tag.model';

import { getTagsCount } from '~/features/shared/tags/tag.service';

export const useGetTagsCount = (filters: MaybeRefOrGetter<TagFilters> = {}) => {
  return useQuery({
    queryFn: async () => {
      return getTagsCount(toValue(filters));
    },
    queryKey: ['tags', 'count', filters],
  });
};
