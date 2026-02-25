import { updateView } from '~/features/shared/views/view.service';

import type { ViewUpdate } from '../view.model';

export const useUpdateView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: ViewUpdate;
    }) => {
      return updateView(id, updates);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['views'] });
      queryClient.invalidateQueries({ queryKey: ['view', id] });
    },
  });
};
