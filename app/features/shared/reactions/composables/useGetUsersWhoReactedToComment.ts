import type { ReactionUserPreview } from '~/features/shared/reactions/reaction.model';

import { getUsersWhoReactedToComment } from '~/features/shared/reactions/reaction.service';

export interface UseGetUsersWhoReactedToCommentParams {
  commentId?: string;
  excludeUserId?: string;
}

export const useGetUsersWhoReactedToComment = (
  params: MaybeRefOrGetter<UseGetUsersWhoReactedToCommentParams> = {}
) => {
  return useQuery({
    enabled: () => Boolean(toValue(params).commentId),
    queryFn: (): Promise<ReactionUserPreview[]> => {
      const _params = toValue(params);

      return getUsersWhoReactedToComment(
        _params.commentId!,
        _params.excludeUserId
      );
    },
    queryKey: ['reactions', 'users-who-reacted-to-comment', params],
  });
};
