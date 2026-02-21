import { updateFollow } from '~/features/shared/follows/follow.service';

import type { FollowUpdate } from '../follow.model';

export const useUpdateFollow = (id: string, updates: FollowUpdate) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return updateFollow(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows'] });
    },
  });
};
