import { getUserReactionToComment } from '~/features/shared/reactions/reaction.service';

export interface UseGetUserReactionToCommentParams {
  commentId?: string;
  userId?: string;
}

export const useGetUserReactionToComment = (
  params: MaybeRefOrGetter<UseGetUserReactionToCommentParams> = {}
) => {
  return useQuery({
    enabled: () => {
      const _params = toValue(params);
      return Boolean(_params.userId && _params.commentId);
    },
    queryFn: () => {
      const _params = toValue(params);

      return getUserReactionToComment(_params.userId!, _params.commentId!);
    },
    queryKey: ['reactions', 'user-reaction-to-comment', params],
  });
};
