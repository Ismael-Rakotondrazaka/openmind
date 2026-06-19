import type { CreateTagBody, IndexTagsQuery } from '#shared/features/tags';
import type { H3Event$Fetch } from 'nitropack/types';

export const getTags = async (
  filters: IndexTagsQuery,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/tags', {
    query: filters,
  });
};

export const findTagByValue = async (
  value: string,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  const { data } = await fetchFn('/api/tags', {
    query: { limit: 1, search: value },
  });
  return data.find(t => t.value === value) ?? null;
};

export const storeTag = async (
  body: CreateTagBody,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  const { data } = await fetchFn('/api/tags', {
    body,
    method: 'POST',
  });
  return data;
};

export const destroyTag = async (
  tagId: string,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  const { data } = await fetchFn(`/api/tags/${tagId}` as '/api/tags/${tagId}', {
    method: 'DELETE',
  });
  return data;
};
