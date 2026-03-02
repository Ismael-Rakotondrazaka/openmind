import { isUsernameExists } from '~/features/shared/users/user.service';

export interface UseIsUsernameExistsParams {
  username: string;
}

export const useIsUsernameExists = (
  params: MaybeRefOrGetter<UseIsUsernameExistsParams>
) => {
  return useQuery({
    queryFn: () => {
      const _params = toValue(params);

      if (!_params.username) {
        return false;
      }

      return isUsernameExists(_params);
    },
    queryKey: ['usernames', 'exists', params],
  });
};
