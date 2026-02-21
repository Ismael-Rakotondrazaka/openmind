import { updatePost } from '~/features/shared/posts/post.service';

import type { PostUpdate } from '../post.model';

export const useUpdatePost = (id: string, updates: PostUpdate) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return updatePost(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
