import type { UserTagFilters } from '~/features/shared/user-tags/user-tag.model';

import { getUserTagsCount } from '~/features/shared/user-tags/user-tag.service';

export const useGetUserTagsCount = (filters?: UserTagFilters) => {
  return useQuery({
    queryFn: async () => {
      return getUserTagsCount(filters ?? {});
    },
    queryKey: ['user-tags', 'count', filters],
  });
};
