import type { ReactionFilters } from '~/features/shared/reactions/reaction.model';

import { getReactionsWithUsers } from '~/features/shared/reactions/reaction.service';

export const useGetReactionsWithUsers = (
  params: MaybeRefOrGetter<ReactionFilters> = {}
) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getReactionsWithUsers(toValue(params));
    },
    queryKey: ['reactions', 'with-users', params],
  });
};
