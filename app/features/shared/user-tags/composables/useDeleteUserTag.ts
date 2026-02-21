import { deleteUserTag } from '~/features/shared/user-tags/user-tag.service';

export const useDeleteUserTag = (userId: string, tagId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return deleteUserTag(userId, tagId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-tags'] });
    },
  });
};
