import { updateComment } from '~/features/shared/comments/comment.service';

import type { CommentUpdate } from '../comment.model';

export const useUpdateComment = (id: string, updates: CommentUpdate) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return updateComment(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};
