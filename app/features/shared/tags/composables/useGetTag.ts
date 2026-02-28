import { getTag } from '~/features/shared/tags/tag.service';

export const useGetTag = (id: MaybeRefOrGetter<string | undefined>) => {
  return useQuery({
    enabled: () => Boolean(toValue(id)),
    queryFn: () => getTag(toValue(id)!),
    queryKey: ['tag', id],
  });
};
