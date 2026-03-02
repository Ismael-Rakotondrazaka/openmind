import { updateSavedPost } from '~/features/shared/saved-posts/saved-post.service';

import type { SavedPostUpdate } from '../saved-post.model';

export const useUpdateSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      updates,
      userId,
    }: {
      postId: string;
      updates: SavedPostUpdate;
      userId: string;
    }) => {
      return updateSavedPost(userId, postId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-posts'] });
    },
  });
};
