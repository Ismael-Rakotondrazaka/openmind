import { createView } from '~/features/shared/views/view.service';

import type { ViewInsert } from '../view.model';

export const useCreateView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (view: ViewInsert) => {
      return createView(view);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['views'] });
    },
  });
};
