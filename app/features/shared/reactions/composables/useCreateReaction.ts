import { createReaction } from '~/features/shared/reactions/reaction.service';

import type { ReactionInsert } from '../reaction.model';

export const useCreateReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reaction: ReactionInsert) => {
      return createReaction(reaction);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['reactions'] });

      if (data.post_id) {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['post', data.post_id] });
      }

      if (data.comment_id) {
        queryClient.invalidateQueries({ queryKey: ['comments'] });
        queryClient.invalidateQueries({
          queryKey: ['comment', data.comment_id],
        });
      }
    },
  });
};
