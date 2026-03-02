import { hasUserReactedToPost } from '~/features/shared/reactions/reaction.service';

export interface UseHasUserReactedToPostParams {
  postId?: string;
  userId?: string;
}

export const useHasUserReactedToPost = (
  params: MaybeRefOrGetter<UseHasUserReactedToPostParams> = {}
) => {
  return useQuery({
    enabled: () => {
      const _params = toValue(params);
      return Boolean(_params.userId && _params.postId);
    },
    initialData: false,
    placeholderData: false,
    queryFn: () => {
      const _params = toValue(params);

      return hasUserReactedToPost(_params.userId!, _params.postId!);
    },
    queryKey: ['reactions', 'has-reacted-to-post', params],
  });
};
