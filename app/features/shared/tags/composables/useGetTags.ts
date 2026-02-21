import type { TagFilters } from '~/features/shared/tags/tag.model';

import { getTags } from '~/features/shared/tags/tag.service';

export const useGetTags = (filters?: TagFilters) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getTags(filters ?? {});
    },
    queryKey: ['tags', filters],
  });
};
