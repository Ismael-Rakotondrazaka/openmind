import type { FollowFilters } from '~/features/shared/follows/follow.model';

import { getFollowing } from '~/features/shared/follows/follow.service';

export const useGetFollowing = (
  filters: MaybeRefOrGetter<FollowFilters> = {}
) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getFollowing(toValue(filters));
    },
    queryKey: ['follows:following', filters],
  });
};
