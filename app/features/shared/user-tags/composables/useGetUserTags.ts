import type { UserTagFilters } from '~/features/shared/user-tags/user-tag.model';

import { getUserTags } from '~/features/shared/user-tags/user-tag.service';

export const useGetUserTags = (filters?: UserTagFilters) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getUserTags(filters ?? {});
    },
    queryKey: ['user-tags', filters],
  });
};
