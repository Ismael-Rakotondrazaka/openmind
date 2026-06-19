import type { PaginationResult } from '#shared/features/paginations';
import type {
  CreatePostBody,
  IndexPostsQuery,
  Post,
  PostListItem,
  UpdatePostBody,
} from '#shared/features/posts';
import type { H3Event$Fetch } from 'nitropack/types';

export const getPosts = async (
  filters: IndexPostsQuery,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
): Promise<PaginationResult<Serialize<PostListItem>>> => {
  const result = await fetchFn('/api/posts', {
    query: filters,
  });
  return result as unknown as PaginationResult<Serialize<PostListItem>>;
};

export const getPost = async (
  postId: string,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
): Promise<Serialize<Post>> => {
  const { data } = await fetchFn(
    `/api/posts/${postId}` as '/api/posts/${postId}'
  );
  return data as unknown as Serialize<Post>;
};

export const storePost = async (
  body: CreatePostBody,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  const { data } = await fetchFn('/api/posts', {
    body,
    method: 'POST',
  });
  return data;
};

export const updatePost = async (
  postId: string,
  body: UpdatePostBody,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  const { data } = await fetchFn(
    `/api/posts/${postId}` as '/api/posts/${postId}',
    {
      body,
      method: 'PATCH',
    }
  );
  return data;
};

export const publishPost = async (
  postId: string,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  const { data } = await fetchFn(
    `/api/posts/${postId}/publish` as '/api/posts/${postId}/publish',
    {
      method: 'POST',
    }
  );
  return data;
};

export const destroyPost = async (
  postId: string,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  await fetchFn(`/api/posts/${postId}` as '/api/posts/${postId}', {
    method: 'DELETE',
  });
};
