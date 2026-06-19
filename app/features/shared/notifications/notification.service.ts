import type {
  IndexNotificationsQuery,
  MarkNotificationsReadBody,
  UpdateNotificationPreferenceBody,
} from '#shared/features/notifications';
import type { H3Event$Fetch } from 'nitropack/types';

export const getUnreadNotificationsCount = async (
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/notifications/unread-count');
};

export const getNotifications = async (
  filters: IndexNotificationsQuery,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/notifications', {
    query: filters,
  });
};

export const markNotificationsRead = async (
  body: MarkNotificationsReadBody,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/notifications/mark-read', {
    body,
    method: 'POST',
  });
};

export const getNotificationPreferences = async (
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  return fetchFn('/api/notifications/preferences');
};

export const updateNotificationPreference = async (
  body: UpdateNotificationPreferenceBody,
  fetchFn: H3Event$Fetch | typeof $fetch = $fetch
) => {
  const { data } = await fetchFn('/api/notifications/preferences', {
    body,
    method: 'PATCH',
  });
  return data;
};
