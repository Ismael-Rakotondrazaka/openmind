import { updateTag } from '~/features/shared/tags/tag.service';

import type { TagUpdate } from '../tag.model';

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TagUpdate }) => {
      return updateTag(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};
