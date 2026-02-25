import type { ReactionFilters } from '~/features/shared/reactions/reaction.model';

import { getReactionsCount } from '~/features/shared/reactions/reaction.service';

export const useGetReactionsCount = (
  filters: MaybeRefOrGetter<ReactionFilters> = {}
) => {
  return useQuery({
    queryFn: async () => {
      return getReactionsCount(toValue(filters));
    },
    queryKey: ['reactions', 'count', filters],
  });
};
