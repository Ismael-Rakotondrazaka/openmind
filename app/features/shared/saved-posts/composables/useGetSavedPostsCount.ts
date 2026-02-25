import type { SavedPostFilters } from '~/features/shared/saved-posts/saved-post.model';

import { getSavedPostsCount } from '~/features/shared/saved-posts/saved-post.service';

export const useGetSavedPostsCount = (
  filters: MaybeRefOrGetter<SavedPostFilters> = {}
) => {
  return useQuery({
    queryFn: async () => {
      return getSavedPostsCount(toValue(filters));
    },
    queryKey: ['saved-posts', 'count', filters],
  });
};
