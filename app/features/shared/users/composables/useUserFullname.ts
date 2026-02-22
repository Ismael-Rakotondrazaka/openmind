export interface UseUserFullnameProps {
  first_name?: null | string;
  last_name?: null | string;
  username?: null | string;
}

export const useUserFullname = <
  T extends MaybeRefOrGetter<UseUserFullnameProps>,
>(
  user: T
) => {
  return computed<string>(() => {
    const userValue = toValue(user);

    if (!userValue.username && !userValue.first_name && !userValue.last_name) {
      return 'User';
    }

    if (!userValue.first_name && !userValue.last_name) {
      return userValue.username || 'User';
    }

    return (
      `${userValue.first_name || ''} ${userValue.last_name || ''}`.trim() ||
      userValue.username ||
      'User'
    );
  });
};
