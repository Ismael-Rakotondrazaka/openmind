import { withQuery } from 'ufo';

export interface UseUserImageUrlProps {
  firstName?: null | string;
  imageUrl?: null | string;
  lastName?: null | string;
}

interface FormatFallbackUrlOptions {
  background?: string;
  bold?: boolean;
  color?: string;
  format?: 'jpeg' | 'jpg' | 'png' | 'webp';
  length?: number;
  size?: number;
}

const defaultOptions: FormatFallbackUrlOptions = {
  bold: true,
  color: 'ffffff',
  format: 'png' as const,
  length: 2,
  size: 200,
};

export const useUserImageUrl = <
  T extends MaybeRefOrGetter<UseUserImageUrlProps>,
>(
  user: T
) => {
  return computed(() => {
    const userValue = toValue(user);

    if (userValue.imageUrl) {
      return userValue.imageUrl;
    }

    return formatFallbackUrl(
      userValue.firstName,
      userValue.lastName,
      defaultOptions
    );
  });
};

/**
 * Generate avatar fallback URL from name parts
 * @param displayName - Translated fallback name (e.g., t('users.defaultUsername'))
 */
export const formatFallbackUrl = (
  firstName?: null | string,
  lastName?: null | string,
  options: FormatFallbackUrlOptions = {},
  displayName: string = ''
) => {
  let name = displayName;

  const parts: string[] = [];
  if (firstName?.trim()) parts.push(firstName.trim());
  if (lastName?.trim()) parts.push(lastName.trim());

  if (parts.length > 0) {
    name = parts.join(' ');
  }

  const params = {
    ...options,
    name,
  };

  Object.keys(params).forEach(key => {
    const paramKey = key as keyof typeof params;
    if (params[paramKey] === undefined || params[paramKey] === null) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete params[paramKey];
    }
  });

  return withQuery('https://ui-avatars.com/api/', params);
};
