import { createReaction } from '~/features/shared/reactions/reaction.service';

import type { ReactionInsert } from '../reaction.model';

export const useCreateReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reaction: ReactionInsert) => {
      return createReaction(reaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reactions'] });
    },
  });
};
