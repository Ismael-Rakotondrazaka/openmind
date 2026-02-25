import { getFollow } from '~/features/shared/follows/follow.service';

export const useGetFollow = (id: MaybeRefOrGetter<string | undefined>) => {
  return useQuery({
    queryFn: async () => {
      const _id = toValue(id);

      if (!_id) {
        return null;
      }

      return getFollow(_id);
    },
    queryKey: ['follow', id],
  });
};
