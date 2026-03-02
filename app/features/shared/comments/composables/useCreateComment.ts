import type { InfiniteData } from '@tanstack/vue-query';

import type { PaginationResult } from '~/features/shared/paginations/pagination.model';

import { createComment } from '~/features/shared/comments/comment.service';

import type { Comment, CommentFilters, CommentInsert } from '../comment.model';

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: CommentInsert) => {
      return createComment(comment);
    },
    onSuccess: newComment => {
      queryClient.setQueriesData<InfiniteData<PaginationResult<Comment>>>(
        {
          predicate: query => {
            const keyFilters = query.queryKey[1] as CommentFilters | undefined;
            return (
              keyFilters?.post_id === newComment.post_id &&
              keyFilters?.parent_id === newComment.parent_id
            );
          },
          queryKey: ['comments'],
        },
        old => {
          if (!old) return old;
          // Deduplicate in case realtime also fires
          const alreadyPresent = old.pages.some(p =>
            p.data.some(c => c.id === newComment.id)
          );
          if (alreadyPresent) return old;
          // Prepend to pages[0] (most recent page — cursor = undefined)
          return {
            ...old,
            pages: old.pages.map((page, i) =>
              i === 0 ? { ...page, data: [newComment, ...page.data] } : page
            ),
          };
        }
      );
    },
  });
};
