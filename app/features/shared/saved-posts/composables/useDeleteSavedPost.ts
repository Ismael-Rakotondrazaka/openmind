import { deleteSavedPost } from '~/features/shared/saved-posts/saved-post.service';

export interface UseDeleteSavedPostParams {
  postId: string;
  userId: string;
}

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, userId }: UseDeleteSavedPostParams) => {
      return deleteSavedPost(userId, postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-posts'] });
    },
  });
};
