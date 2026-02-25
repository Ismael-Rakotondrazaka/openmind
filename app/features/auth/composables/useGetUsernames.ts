import { getUsernames } from '~/features/shared/users/user.service';

export interface UseGetUsernamesParams {
  limit?: number;
  username: string;
}

export const useGetUsernames = (
  params: MaybeRefOrGetter<UseGetUsernamesParams>
) => {
  return useQuery({
    queryFn: () => {
      const _params = toValue(params);

      if (!_params.username) {
        return {
          count: 0,
          data: [],
        };
      }

      return getUsernames(_params);
    },
    queryKey: ['usernames', params],
  });
};
