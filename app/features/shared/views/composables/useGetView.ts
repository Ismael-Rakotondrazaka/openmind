import { getView } from '~/features/shared/views/view.service';

export const useGetView = (id?: string) => {
  return useQuery({
    queryFn: async () => {
      if (!id) {
        return null;
      }

      return getView(id);
    },
    queryKey: ['views', id],
  });
};
