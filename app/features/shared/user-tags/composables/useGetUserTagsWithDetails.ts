import { getUserTagsWithDetails } from '~/features/shared/user-tags/user-tag.service';

export const useGetUserTagsWithDetails = (
  userId: MaybeRefOrGetter<string | undefined>
) => {
  return useQuery({
    enabled: () => Boolean(toValue(userId)),
    queryFn: () => getUserTagsWithDetails(toValue(userId)!),
    queryKey: ['user-tags-with-details', userId],
  });
};
