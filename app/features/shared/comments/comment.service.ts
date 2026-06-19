import type {
  Comment,
  CreateCommentBody,
  IndexCommentsQuery,
  UpdateCommentBody,
} from '#shared/features/comments';
import type { PaginationResult } from '#shared/features/paginations';
import type { H3Event$Fetch } from 'nitropack/types';

export const getComments = async (
  filters: IndexCommentsQuery,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
): Promise<PaginationResult<Serialize<Comment>>> => {
  const result = await fetchFn('/api/comments', {
    query: filters,
  });
  return result as unknown as PaginationResult<Serialize<Comment>>;
};

export const storeComment = async (
  body: CreateCommentBody,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  const { data } = await fetchFn('/api/comments', {
    body,
    method: 'POST',
  });
  return data;
};

export const updateComment = async (
  commentId: string,
  body: UpdateCommentBody,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  const { data } = await fetchFn(
    `/api/comments/${commentId}` as '/api/comments/${commentId}',
    {
      body,
      method: 'PATCH',
    }
  );
  return data;
};

export const destroyComment = async (
  commentId: string,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  await fetchFn(`/api/comments/${commentId}` as '/api/comments/${commentId}', {
    method: 'DELETE',
  });
};
