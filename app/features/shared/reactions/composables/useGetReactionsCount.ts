import type { ReactionFilters } from '~/features/shared/reactions/reaction.model';

import { getReactionsCount } from '~/features/shared/reactions/reaction.service';

export const useGetReactionsCount = (filters?: ReactionFilters) => {
  return useQuery({
    queryFn: async () => {
      return getReactionsCount(filters ?? {});
    },
    queryKey: ['reactions', 'count', filters],
  });
};
