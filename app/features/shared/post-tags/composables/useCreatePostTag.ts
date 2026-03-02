import { createPostTag } from '~/features/shared/post-tags/post-tag.service';

import type { PostTagInsert } from '../post-tag.model';

export const useCreatePostTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postTag: PostTagInsert) => {
      return createPostTag(postTag);
    },
    onSuccess: (_, { post_id }) => {
      queryClient.invalidateQueries({ queryKey: ['post-tags'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', post_id] });
    },
  });
};
