import { deleteView } from '~/features/shared/views/view.service';

export const useDeleteView = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return deleteView(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['views'] });
    },
  });
};
