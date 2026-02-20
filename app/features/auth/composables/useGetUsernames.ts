import { getUsernames } from '~/features/shared/users/user.service';

export interface UseGetUsernamesParams {
  limit?: number;
  username: string;
}

export const useGetUsernames = (params: UseGetUsernamesParams) => {
  return useQuery({
    queryFn: () => {
      if (!params.username) {
        return {
          count: 0,
          data: [],
        };
      }

      return getUsernames(params);
    },
    queryKey: ['usernames'],
  });
};
