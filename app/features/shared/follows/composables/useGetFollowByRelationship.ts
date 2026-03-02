import { getFollows } from '~/features/shared/follows/follow.service';

export const useGetFollowByRelationship = (
  followerId: MaybeRefOrGetter<string | undefined>,
  followingId: MaybeRefOrGetter<string | undefined>
) => {
  return useQuery({
    enabled: () =>
      Boolean(toValue(followerId)) &&
      Boolean(toValue(followingId)) &&
      toValue(followerId) !== toValue(followingId),
    queryFn: () =>
      getFollows({
        follower_id: toValue(followerId)!,
        following_id: toValue(followingId)!,
        limit: 1,
      }),
    queryKey: [
      'follows',
      { follower_id: followerId, following_id: followingId },
    ],
  });
};
