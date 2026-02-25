import { updateFollow } from '~/features/shared/follows/follow.service';

import type { FollowUpdate } from '../follow.model';

export const useUpdateFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: FollowUpdate;
    }) => {
      return updateFollow(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows'] });
    },
  });
};
