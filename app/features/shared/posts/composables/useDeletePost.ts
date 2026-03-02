import { deletePost } from '~/features/shared/posts/post.service';

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return deletePost(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    },
  });
};
