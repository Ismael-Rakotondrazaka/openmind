export interface UseUserFullnameProps {
  first_name?: null | string;
  last_name?: null | string;
  username?: null | string;
}

export const getUserFullname = <T extends UseUserFullnameProps>(user: T) => {
  if (!user.username && !user.first_name && !user.last_name) {
    return 'User';
  }

  if (!user.first_name && !user.last_name) {
    return user.username || 'User';
  }

  return (
    `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
    user.username ||
    'User'
  );
};

export const useUserFullname = <
  T extends MaybeRefOrGetter<UseUserFullnameProps>,
>(
  user: T
) => {
  return computed<string>(() => {
    const userValue = toValue(user);

    return getUserFullname(userValue);
  });
};
