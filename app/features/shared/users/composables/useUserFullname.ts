export interface UseUserFullnameProps {
  firstName?: null | string;
  lastName?: null | string;
  username?: null | string;
}

/**
 * Get user fullname with fallback to username or default
 * Always pass defaultUsername from i18n (t('users.defaultUsername'))
 */
export const getUserFullname = <T extends UseUserFullnameProps>(
  user: T,
  defaultUsername?: string
) => {
  if (!user.username && !user.firstName && !user.lastName) {
    return defaultUsername || '';
  }

  if (!user.firstName && !user.lastName) {
    return user.username || defaultUsername || '';
  }

  return (
    `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
    user.username ||
    defaultUsername ||
    ''
  );
};

/**
 * Composable to get user fullname
 * Optionally pass defaultUsername from t('users.defaultUsername')
 */
export const useUserFullname = <
  T extends MaybeRefOrGetter<UseUserFullnameProps>,
>(
  user: T,
  defaultUsername?: string
) => {
  return computed<string>(() => {
    const userValue = toValue(user);

    return getUserFullname(userValue, defaultUsername);
  });
};
