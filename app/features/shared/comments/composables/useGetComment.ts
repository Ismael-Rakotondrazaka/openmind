import { getComment } from '~/features/shared/comments/comment.service';

export const useGetComment = (id: MaybeRefOrGetter<string | undefined>) => {
  return useQuery({
    enabled: () => Boolean(toValue(id)),
    queryFn: () => getComment(toValue(id)!),
    queryKey: ['comment', id],
  });
};
