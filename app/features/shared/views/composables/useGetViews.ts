import type { ViewFilters } from '~/features/shared/views/view.model';

import { getViews } from '~/features/shared/views/view.service';

export const useGetViews = (filters?: ViewFilters) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getViews(filters ?? {});
    },
    queryKey: ['views', filters],
  });
};
