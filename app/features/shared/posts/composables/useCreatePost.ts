import { createPost } from '~/features/shared/posts/post.service';

import type { PostInsert } from '../post.model';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: PostInsert) => {
      return createPost(post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
