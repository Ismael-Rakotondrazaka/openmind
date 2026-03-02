import { getFollow } from '~/features/shared/follows/follow.service';

export const useGetFollow = (id: MaybeRefOrGetter<string | undefined>) => {
  return useQuery({
    enabled: () => Boolean(toValue(id)),
    queryFn: () => getFollow(toValue(id)!),
    queryKey: ['follow', id],
  });
};
