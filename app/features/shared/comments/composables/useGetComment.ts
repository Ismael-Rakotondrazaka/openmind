import { getComment } from '~/features/shared/comments/comment.service';

export const useGetComment = (id: MaybeRefOrGetter<string | undefined>) => {
  return useQuery({
    queryFn: async () => {
      const _id = toValue(id);

      if (!_id) {
        return null;
      }

      return getComment(_id);
    },
    queryKey: ['comment', id],
  });
};
