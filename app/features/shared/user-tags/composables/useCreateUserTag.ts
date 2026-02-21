import { createUserTag } from '~/features/shared/user-tags/user-tag.service';

import type { UserTagInsert } from '../user-tag.model';

export const useCreateUserTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userTag: UserTagInsert) => {
      return createUserTag(userTag);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-tags'] });
    },
  });
};
