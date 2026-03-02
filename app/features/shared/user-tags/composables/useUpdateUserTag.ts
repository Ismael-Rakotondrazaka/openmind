import { updateUserTag } from '~/features/shared/user-tags/user-tag.service';

import type { UserTagUpdate } from '../user-tag.model';

export const useUpdateUserTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tagId,
      updates,
      userId,
    }: {
      tagId: string;
      updates: UserTagUpdate;
      userId: string;
    }) => {
      return updateUserTag(userId, tagId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-tags'] });
    },
  });
};
