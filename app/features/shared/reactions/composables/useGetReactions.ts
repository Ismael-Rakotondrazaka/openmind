import type { ReactionFilters } from '~/features/shared/reactions/reaction.model';

import { getReactions } from '~/features/shared/reactions/reaction.service';

export const useGetReactions = (filters?: ReactionFilters) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getReactions(filters ?? {});
    },
    queryKey: ['reactions', filters],
  });
};
