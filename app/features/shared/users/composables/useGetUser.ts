import { getUser } from '~/features/shared/users/user.service';

export const useGetUser = (id: MaybeRefOrGetter<string | undefined>) => {
  return useQuery({
    enabled: () => Boolean(toValue(id)),
    queryFn: () => getUser(toValue(id)!),
    queryKey: ['user', id],
  });
};
