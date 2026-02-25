import { getTag } from '~/features/shared/tags/tag.service';

export const useGetTag = (id: MaybeRefOrGetter<string | undefined>) => {
  return useQuery({
    queryFn: async () => {
      const _id = toValue(id);

      if (!_id) {
        return null;
      }

      return getTag(_id);
    },
    queryKey: ['tags', id],
  });
};
