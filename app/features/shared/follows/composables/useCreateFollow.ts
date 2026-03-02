import { createFollow } from '~/features/shared/follows/follow.service';

import type { FollowInsert } from '../follow.model';

export const useCreateFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (follow: FollowInsert) => {
      return createFollow(follow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows'] });
    },
  });
};
