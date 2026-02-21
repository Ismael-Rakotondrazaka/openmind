import { getUser } from '~/features/shared/users/user.service';

export const useGetUser = (id?: string) => {
  return useQuery({
    queryFn: async () => {
      if (!id) {
        return null;
      }

      return getUser(id);
    },
    queryKey: ['users', id],
  });
};
