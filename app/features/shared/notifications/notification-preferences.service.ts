import type { NotificationPreference } from './notification-preferences.model';

export const getNotificationPreferences = async (
  _userId: string
): Promise<NotificationPreference[]> => {
  return $fetch<NotificationPreference[]>('/api/notifications/preferences');
};

export const setNotificationPreference = async (
  _userId: string,
  groupName: string,
  channel: string,
  enabled: boolean
): Promise<void> => {
  await $fetch('/api/notifications/preferences', {
    body: { channel, enabled, groupName },
    method: 'PATCH',
  });
};
