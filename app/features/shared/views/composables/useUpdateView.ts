import { updateView } from '~/features/shared/views/view.service';

import type { ViewUpdate } from '../view.model';

export const useUpdateView = (id: string, updates: ViewUpdate) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return updateView(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['views'] });
    },
  });
};
