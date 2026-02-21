import type { ViewFilters } from '~/features/shared/views/view.model';

import { getViewsCount } from '~/features/shared/views/view.service';

export const useGetViewsCount = (filters?: ViewFilters) => {
  return useQuery({
    queryFn: async () => {
      return getViewsCount(filters ?? {});
    },
    queryKey: ['views', 'count', filters],
  });
};
