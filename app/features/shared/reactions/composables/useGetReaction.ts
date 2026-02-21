import { getReaction } from '~/features/shared/reactions/reaction.service';

export const useGetReaction = (id?: string) => {
  return useQuery({
    queryFn: async () => {
      if (!id) {
        return null;
      }

      return getReaction(id);
    },
    queryKey: ['reactions', id],
  });
};
