import { deleteUserTag } from '~/features/shared/user-tags/user-tag.service';

export const useDeleteUserTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tagId,
      userId,
    }: {
      tagId: string;
      userId: string;
    }) => {
      return deleteUserTag(userId, tagId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-tags'] });
    },
  });
};
