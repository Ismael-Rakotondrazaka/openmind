import { getView } from '~/features/shared/views/view.service';

export const useGetView = (id: MaybeRefOrGetter<string | undefined>) => {
  return useQuery({
    enabled: () => Boolean(toValue(id)),
    queryFn: () => getView(toValue(id)!),
    queryKey: ['view', id],
  });
};
