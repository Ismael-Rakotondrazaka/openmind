import { getView } from '~/features/shared/views/view.service';

export const useGetView = (id: MaybeRefOrGetter<string | undefined>) => {
  return useQuery({
    queryFn: async () => {
      const _id = toValue(id);

      if (!_id) {
        return null;
      }

      return getView(_id);
    },
    queryKey: ['views', id],
  });
};
