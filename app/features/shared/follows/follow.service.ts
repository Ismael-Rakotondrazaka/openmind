import type {
  IndexFollowsQuery,
  ToggleFollowBody,
} from '#shared/features/follows';
import type { H3Event$Fetch } from 'nitropack/types';

export const getFollows = async (
  filters: IndexFollowsQuery,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/follows', {
    query: filters,
  });
};

export const toggleFollow = async (
  body: ToggleFollowBody,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/follows/toggle', {
    body,
    method: 'POST',
  });
};
