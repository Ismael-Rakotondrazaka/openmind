import { updateTag } from '~/features/shared/tags/tag.service';

import type { TagUpdate } from '../tag.model';

export const useUpdateTag = (id: string, updates: TagUpdate) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return updateTag(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};
