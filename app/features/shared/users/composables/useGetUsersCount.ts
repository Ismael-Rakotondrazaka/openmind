import type { UserFilters } from '~/features/shared/users/user.model';

import { getUsersCount } from '~/features/shared/users/user.service';

export const useGetUsersCount = (filters?: UserFilters) => {
  return useQuery({
    queryFn: async () => {
      return getUsersCount(filters ?? {});
    },
    queryKey: ['users', 'count', filters],
  });
};
