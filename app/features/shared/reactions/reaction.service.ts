import type { PaginationResult } from '#shared/features/paginations';
import type {
  IndexReactionsQuery,
  ReactionWithUser,
  ToggleReactionBody,
} from '#shared/features/reactions';
import type { H3Event$Fetch } from 'nitropack/types';

export const getReactions = async (
  filters: IndexReactionsQuery,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
): Promise<PaginationResult<Serialize<ReactionWithUser>>> => {
  const result = await fetchFn('/api/reactions', { query: filters });
  return result as unknown as PaginationResult<Serialize<ReactionWithUser>>;
};

export const toggleReaction = async (
  body: ToggleReactionBody,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/reactions/toggle', {
    body,
    method: 'POST',
  });
};
