import { updateUserTag } from '~/features/shared/user-tags/user-tag.service';

import type { UserTagUpdate } from '../user-tag.model';

export const useUpdateUserTag = (
  userId: string,
  tagId: string,
  updates: UserTagUpdate
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return updateUserTag(userId, tagId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-tags'] });
    },
  });
};
