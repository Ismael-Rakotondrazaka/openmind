import { isPostSaved } from '~/features/shared/saved-posts/saved-post.service';

export interface UseIsPostSavedParams {
  postId?: string;
  userId?: string;
}

export const useIsPostSaved = (
  params: MaybeRefOrGetter<UseIsPostSavedParams> = {}
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

      return isPostSaved(_params.userId!, _params.postId!);
    },
    queryKey: ['saved-posts', 'is-saved', params],
  });
};
