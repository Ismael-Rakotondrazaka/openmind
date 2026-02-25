import { deleteFollow } from '~/features/shared/follows/follow.service';

export const useDeleteFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return deleteFollow(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows'] });
    },
  });
};
