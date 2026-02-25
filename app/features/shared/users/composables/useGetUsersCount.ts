import type { UserFilters } from '~/features/shared/users/user.model';

import { getUsersCount } from '~/features/shared/users/user.service';

export const useGetUsersCount = (
  filters: MaybeRefOrGetter<UserFilters> = {}
) => {
  return useQuery({
    queryFn: async () => {
      return getUsersCount(toValue(filters));
    },
    queryKey: ['users', 'count', filters],
  });
};
