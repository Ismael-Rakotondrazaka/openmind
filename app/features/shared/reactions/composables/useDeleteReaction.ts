import { deleteReaction } from '~/features/shared/reactions/reaction.service';

export const useDeleteReaction = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return deleteReaction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reactions'] });
    },
  });
};
