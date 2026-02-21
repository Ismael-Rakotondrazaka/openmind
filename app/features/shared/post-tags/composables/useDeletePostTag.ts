import { deletePostTag } from '~/features/shared/post-tags/post-tag.service';

export const useDeletePostTag = (postId: string, tagId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return deletePostTag(postId, tagId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-tags'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
