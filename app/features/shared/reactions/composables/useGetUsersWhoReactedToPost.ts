import type { ReactionUserPreview } from '~/features/shared/reactions/reaction.model';

import { getUsersWhoReactedToPost } from '~/features/shared/reactions/reaction.service';

export interface UseGetUsersWhoReactedToPostParams {
  excludeUserId?: string;
  limit?: number;
  orderBy?: 'created_at';
  postId: string;
  sortOrder?: 'asc' | 'desc';
}

export const useGetUsersWhoReactedToPost = (
  params: MaybeRefOrGetter<UseGetUsersWhoReactedToPostParams>
) => {
  return useQuery({
    enabled: () => Boolean(toValue(params).postId),
    queryFn: (): Promise<ReactionUserPreview[]> => {
      const _params = toValue(params);

      return getUsersWhoReactedToPost({
        excludeUserId: _params.excludeUserId,
        limit: _params.limit,
        postId: _params.postId!,
        sortOrder: _params.sortOrder,
      });
    },
    queryKey: ['reactions', 'users-who-reacted-to-post', params],
  });
};
