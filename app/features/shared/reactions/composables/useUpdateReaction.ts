import { updateReaction } from '~/features/shared/reactions/reaction.service';

import type { ReactionUpdate } from '../reaction.model';

export const useUpdateReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string } & ReactionUpdate) => {
      return updateReaction(params.id, params);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['reactions'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      if (data.comment_id) {
        queryClient.invalidateQueries({
          queryKey: ['comments', data.comment_id],
        });
      }
    },
  });
};
