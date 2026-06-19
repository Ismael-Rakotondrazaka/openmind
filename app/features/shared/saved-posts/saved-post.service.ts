import type {
  IndexSavedPostsQuery,
  ToggleSavedPostBody,
} from '#shared/features/saved-posts';
import type { H3Event$Fetch } from 'nitropack/types';

export const getSavedPosts = async (
  filters: IndexSavedPostsQuery,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/saved-posts', {
    query: filters,
  });
};

export const isSavedPost = async (
  { postId }: { postId: string },
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  const { isSaved } = await fetchFn('/api/saved-posts/is-saved' as const, {
    query: { postId },
  });
  return isSaved;
};

export const toggleSavedPost = async (
  body: ToggleSavedPostBody,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/saved-posts/toggle', {
    body,
    method: 'POST',
  });
};
