import { updatePost } from '~/features/shared/posts/post.service';

import type { PostUpdate } from '../post.model';

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: PostUpdate;
    }) => {
      return updatePost(id, updates);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    },
  });
};
