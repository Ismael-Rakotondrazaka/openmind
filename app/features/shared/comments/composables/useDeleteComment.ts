import { deleteComment } from '~/features/shared/comments/comment.service';

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return deleteComment(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['comment', id] });
    },
  });
};
