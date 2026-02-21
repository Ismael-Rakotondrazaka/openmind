import { updateReaction } from '~/features/shared/reactions/reaction.service';

import type { ReactionUpdate } from '../reaction.model';

export const useUpdateReaction = (id: string, updates: ReactionUpdate) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return updateReaction(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reactions'] });
    },
  });
};
