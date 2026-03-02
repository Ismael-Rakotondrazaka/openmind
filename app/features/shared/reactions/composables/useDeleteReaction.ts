import { deleteReaction } from '~/features/shared/reactions/reaction.service';

export const useDeleteReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return deleteReaction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reactions'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['comment'] });
    },
  });
};
