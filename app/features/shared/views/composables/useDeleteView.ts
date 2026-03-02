import { deleteView } from '~/features/shared/views/view.service';

export const useDeleteView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return deleteView(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['views'] });
      queryClient.invalidateQueries({ queryKey: ['view', id] });
    },
  });
};
