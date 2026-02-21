import { getFollow } from '~/features/shared/follows/follow.service';

export const useGetFollow = (id?: string) => {
  return useQuery({
    queryFn: async () => {
      if (!id) {
        return null;
      }

      return getFollow(id);
    },
    queryKey: ['follows', id],
  });
};
