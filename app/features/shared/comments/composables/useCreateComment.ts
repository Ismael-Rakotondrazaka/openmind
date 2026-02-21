import { createComment } from '~/features/shared/comments/comment.service';

import type { CommentInsert } from '../comment.model';

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: CommentInsert) => {
      return createComment(comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};
