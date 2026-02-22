import { hasUserReactedToComment } from '~/features/shared/reactions/reaction.service';

export interface UseHasUserReactedToCommentParams {
  commentId?: string;
  userId?: string;
}

export const useHasUserReactedToComment = (
  params: MaybeRefOrGetter<UseHasUserReactedToCommentParams> = {}
) => {
  return useQuery({
    enabled: () => {
      const _params = toValue(params);
      return Boolean(_params.userId && _params.commentId);
    },
    initialData: false,
    placeholderData: false,
    queryFn: () => {
      const _params = toValue(params);

      return hasUserReactedToComment(_params.userId!, _params.commentId!);
    },
    queryKey: ['reactions', 'has-reacted-to-comment', params],
  });
};
