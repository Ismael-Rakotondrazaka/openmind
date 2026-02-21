import { deleteComment } from '~/features/shared/comments/comment.service';

export const useDeleteComment = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return deleteComment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};
