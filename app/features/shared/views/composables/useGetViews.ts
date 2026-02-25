import type { ViewFilters } from '~/features/shared/views/view.model';

import { getViews } from '~/features/shared/views/view.service';

export const useGetViews = (filters: MaybeRefOrGetter<ViewFilters> = {}) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getViews(toValue(filters));
    },
    queryKey: ['views', filters],
  });
};
