import { defineMutation, defineQueryOptions } from '@pinia/colada';

import type { WithFetchFn } from '~/utils/query';

import { isUsernameExists } from '../shared/users/user.service';
import { updateAuthUserEmail, updateAuthUserPassword } from './auth.service';

export const AUTH_QUERY_KEYS = {
  usernameExists: (username: string) =>
    ['users', 'username-exists', username] as const,
};

export const usernameExistsQuery = defineQueryOptions(
  ({ fetchFn, username }: WithFetchFn<{ username: string }>) => ({
    enabled: Boolean(username),
    key: AUTH_QUERY_KEYS.usernameExists(username),
    query: async () => {
      if (!username) return false;
      return isUsernameExists({ username }, fetchFn);
    },
  })
);

export const useUpdateAuthUserEmail = defineMutation(() => {
  return {
    mutation: updateAuthUserEmail,
  };
});

export const useUpdateAuthUserPassword = defineMutation(() => {
  return {
    mutation: updateAuthUserPassword,
  };
});
