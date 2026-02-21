import { deleteSavedPost } from '~/features/shared/saved-posts/saved-post.service';

export const useDeleteSavedPost = (userId: string, postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return deleteSavedPost(userId, postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-posts'] });
    },
  });
};
