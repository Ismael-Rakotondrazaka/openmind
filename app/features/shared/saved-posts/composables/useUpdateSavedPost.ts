import { updateSavedPost } from '~/features/shared/saved-posts/saved-post.service';

import type { SavedPostUpdate } from '../saved-post.model';

export const useUpdateSavedPost = (
  userId: string,
  postId: string,
  updates: SavedPostUpdate
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return updateSavedPost(userId, postId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-posts'] });
    },
  });
};
