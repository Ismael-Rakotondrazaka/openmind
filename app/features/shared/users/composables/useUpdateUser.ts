import { updateUser } from '~/features/shared/users/user.service';

import type { UserUpdate } from '../user.model';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UserUpdate;
    }) => {
      return updateUser(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};
