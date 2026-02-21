import { deleteFollow } from '~/features/shared/follows/follow.service';

export const useDeleteFollow = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return deleteFollow(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows'] });
    },
  });
};
