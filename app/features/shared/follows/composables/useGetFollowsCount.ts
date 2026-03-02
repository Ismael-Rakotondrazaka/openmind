import type { FollowFilters } from '~/features/shared/follows/follow.model';

import { getFollowsCount } from '~/features/shared/follows/follow.service';

export const useGetFollowsCount = (
  filters: MaybeRefOrGetter<FollowFilters> = {}
) => {
  return useQuery({
    queryFn: async () => {
      return getFollowsCount(toValue(filters));
    },
    queryKey: ['follows', 'count', filters],
  });
};
