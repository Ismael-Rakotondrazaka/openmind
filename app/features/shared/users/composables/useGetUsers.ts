import type { UserFilters } from '~/features/shared/users/user.model';

import { getUsers } from '~/features/shared/users/user.service';

export const useGetUsers = (filters: MaybeRefOrGetter<UserFilters> = {}) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getUsers(toValue(filters));
    },
    queryKey: ['users', filters],
  });
};
