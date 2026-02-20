import { isUsernameExists } from '~/features/shared/users/user.service';

export interface UseIsUsernameExistsParams {
  username: string;
}

export const useIsUsernameExists = (params: UseIsUsernameExistsParams) => {
  return useQuery({
    queryFn: () => {
      if (!params.username) {
        return false;
      }

      return isUsernameExists(params);
    },
    queryKey: ['username', 'exists', params],
  });
};
