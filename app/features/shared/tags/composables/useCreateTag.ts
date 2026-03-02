import { createTag } from '~/features/shared/tags/tag.service';

import type { TagInsert } from '../tag.model';

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tag: TagInsert) => {
      return createTag(tag);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};
