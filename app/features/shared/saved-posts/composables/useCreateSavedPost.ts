import { createSavedPost } from '~/features/shared/saved-posts/saved-post.service';

import type { SavedPostInsert } from '../saved-post.model';

export const useCreateSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (savedPost: SavedPostInsert) => {
      return createSavedPost(savedPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-posts'] });
    },
  });
};
