import { getUser } from '~/features/shared/users/user.service';

export const useGetUser = (id: MaybeRefOrGetter<string | undefined>) => {
  return useQuery({
    queryFn: async () => {
      const _id = toValue(id);

      if (!_id) {
        return null;
      }

      return getUser(_id);
    },
    queryKey: ['user', id],
  });
};
