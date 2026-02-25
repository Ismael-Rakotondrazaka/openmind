import type { SavedPostFilters } from '~/features/shared/saved-posts/saved-post.model';

import { getSavedPosts } from '~/features/shared/saved-posts/saved-post.service';

export const useGetSavedPosts = (
  filters: MaybeRefOrGetter<SavedPostFilters> = {}
) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return getSavedPosts(toValue(filters));
    },
    queryKey: ['saved-posts', filters],
  });
};
