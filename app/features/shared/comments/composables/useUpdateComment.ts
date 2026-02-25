import { updateComment } from '~/features/shared/comments/comment.service';

import type { CommentUpdate } from '../comment.model';

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: CommentUpdate;
    }) => {
      return updateComment(id, updates);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['comment', id] });
    },
  });
};
