import type { NotificationPreference } from './notification-preferences.model';

export const getNotificationPreferences = async (
  userId: string
): Promise<NotificationPreference[]> => {
  const client = useSupabaseClient();

  const { data, error } = await client
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  return data ?? [];
};

export const setNotificationPreference = async (
  userId: string,
  groupName: string,
  channel: string,
  enabled: boolean
): Promise<void> => {
  const client = useSupabaseClient();

  const { error } = await client.from('notification_preferences').upsert({
    channel,
    enabled,
    group_name: groupName,
    user_id: userId,
  });

  if (error) throw error;
};
