import { deleteTag } from '~/features/shared/tags/tag.service';

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return deleteTag(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['tag', id] });
    },
  });
};
