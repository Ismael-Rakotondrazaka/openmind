import type { TagFilters } from '~/features/shared/tags/tag.model';

import { getTags } from '~/features/shared/tags/tag.service';

export const useGetTags = (filters: MaybeRefOrGetter<TagFilters> = {}) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getTags(toValue(filters));
    },
    queryKey: ['tags', filters],
  });
};
