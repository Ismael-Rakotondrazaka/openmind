import { deletePostTag } from '~/features/shared/post-tags/post-tag.service';

export const useDeletePostTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      tagId,
    }: {
      postId: string;
      tagId: string;
    }) => {
      return deletePostTag(postId, tagId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-tags'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
