import { getReaction } from '~/features/shared/reactions/reaction.service';

export const useGetReaction = (id: MaybeRefOrGetter<string | undefined>) => {
  return useQuery({
    enabled: () => Boolean(toValue(id)),
    queryFn: () => getReaction(toValue(id)!),
    queryKey: ['reaction', id],
  });
};
