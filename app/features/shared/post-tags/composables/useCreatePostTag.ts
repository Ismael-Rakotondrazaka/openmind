import { createPostTag } from '~/features/shared/post-tags/post-tag.service';

import type { PostTagInsert } from '../post-tag.model';

export const useCreatePostTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postTag: PostTagInsert) => {
      return createPostTag(postTag);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-tags'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
