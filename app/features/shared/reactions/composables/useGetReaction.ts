import { getReaction } from '~/features/shared/reactions/reaction.service';

export const useGetReaction = (id: MaybeRefOrGetter<string | undefined>) => {
  return useQuery({
    queryFn: async () => {
      const _id = toValue(id);

      if (!_id) {
        return null;
      }

      return getReaction(_id);
    },
    queryKey: ['reactions', id],
  });
};
