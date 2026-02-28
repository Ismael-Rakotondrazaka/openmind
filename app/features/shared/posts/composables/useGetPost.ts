import { getPost } from '~/features/shared/posts/post.service';

export const useGetPost = (id: MaybeRefOrGetter<string | undefined>) => {
  return useQuery({
    enabled: () => Boolean(toValue(id)),
    queryFn: () => getPost(toValue(id)!),
    queryKey: ['post', id],
  });
};
