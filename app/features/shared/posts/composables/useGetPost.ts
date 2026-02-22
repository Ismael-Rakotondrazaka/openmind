import { getPost } from '~/features/shared/posts/post.service';

export const useGetPost = (id: MaybeRefOrGetter<string | undefined>) => {
  return useQuery({
    queryFn: async () => {
      const _id = toValue(id);

      if (!_id) {
        return null;
      }

      return getPost(_id);
    },
    queryKey: ['post', id],
  });
};
