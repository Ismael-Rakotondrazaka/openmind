import { getUserReactionToPost } from '~/features/shared/reactions/reaction.service';

export interface UseGetUserReactionToPostParams {
  postId?: string;
  userId?: string;
}

export const useGetUserReactionToPost = (
  params: MaybeRefOrGetter<UseGetUserReactionToPostParams> = {}
) => {
  return useQuery({
    enabled: () => {
      const _params = toValue(params);
      return Boolean(_params.userId && _params.postId);
    },
    queryFn: () => {
      const _params = toValue(params);

      return getUserReactionToPost(_params.userId!, _params.postId!);
    },
    queryKey: ['reactions', 'user-reaction-to-post', params],
  });
};
