import { getPost } from '~/features/shared/posts/post.service';

export const useGetPost = (id?: string) => {
  return useQuery({
    queryFn: async () => {
      if (!id) {
        return null;
      }

      return getPost(id);
    },
    queryKey: ['posts', id],
  });
};
