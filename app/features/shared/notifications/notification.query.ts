import type {
  IndexNotificationsQuery,
  MarkNotificationsReadBody,
  UpdateNotificationPreferenceBody,
} from '#shared/features/notifications';

import {
  defineMutation,
  defineQueryOptions,
  useQueryCache,
} from '@pinia/colada';

import type { WithFetchFn } from '~/utils/query';

import {
  getNotificationPreferences,
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationsRead,
  updateNotificationPreference,
} from './notification.service';

export const NOTIFICATION_QUERY_KEYS = {
  list: (filters: IndexNotificationsQuery = {}) =>
    [...NOTIFICATION_QUERY_KEYS.root, 'list', filters] as const,

  preferences: () => [...NOTIFICATION_QUERY_KEYS.root, 'preferences'] as const,

  root: ['notifications'] as const,

  unreadCount: () => [...NOTIFICATION_QUERY_KEYS.root, 'unread-count'] as const,
};

export const unreadNotificationsCountQuery = defineQueryOptions(
  ({ fetchFn }: WithFetchFn = {}) => ({
    key: NOTIFICATION_QUERY_KEYS.unreadCount(),
    query: () => getUnreadNotificationsCount(fetchFn),
  })
);

export const notificationListQuery = defineQueryOptions(
  ({ fetchFn, ...filters }: WithFetchFn<IndexNotificationsQuery> = {}) => ({
    key: NOTIFICATION_QUERY_KEYS.list(filters as IndexNotificationsQuery),
    placeholderData: previousData => previousData,
    query: () => getNotifications(filters as IndexNotificationsQuery, fetchFn),
  })
);

export const notificationPreferencesQuery = defineQueryOptions(
  ({ fetchFn }: WithFetchFn = {}) => ({
    key: NOTIFICATION_QUERY_KEYS.preferences(),
    query: () => getNotificationPreferences(fetchFn),
  })
);

export const useMarkNotificationsRead = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ body }: { body: MarkNotificationsReadBody }) =>
      markNotificationsRead(body),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: NOTIFICATION_QUERY_KEYS.root });
    },
  };
});

export const useUpdateNotificationPreference = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: ({ body }: { body: UpdateNotificationPreferenceBody }) =>
      updateNotificationPreference(body),
    onSuccess: () => {
      queryCache.invalidateQueries({
        key: NOTIFICATION_QUERY_KEYS.preferences(),
      });
    },
  };
});

export const useMarkAllNotificationsRead = defineMutation(() => {
  const queryCache = useQueryCache();
  return {
    mutation: () => markNotificationsRead({}),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: NOTIFICATION_QUERY_KEYS.root });
    },
  };
});
