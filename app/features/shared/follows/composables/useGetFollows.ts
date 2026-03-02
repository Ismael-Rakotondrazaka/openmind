import type { FollowFilters } from '~/features/shared/follows/follow.model';

import { getFollows } from '~/features/shared/follows/follow.service';

export const useGetFollows = (
  filters: MaybeRefOrGetter<FollowFilters> = {}
) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getFollows(toValue(filters));
    },
    queryKey: ['follows', filters],
  });
};
