import type { PostTagQuery } from '#shared/features/post-tags';
import type { H3Event$Fetch } from 'nitropack/types';

export const getPostTags = async (
  filters: PostTagQuery,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/post-tags', {
    query: filters,
  });
};

export const createPostTag = async (
  body: { postId: string; tagId: string },
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/post-tags', { body, method: 'POST' });
};

export const deletePostTag = async (
  postId: string,
  tagId: string,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  await fetchFn(
    `/api/post-tags/${postId}/${tagId}` as `/api/post-tags/${string}/${string}`,
    { method: 'DELETE' }
  );
};
