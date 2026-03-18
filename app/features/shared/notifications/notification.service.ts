import type { PaginationResult } from '../paginations/pagination.model';
import type { Notification, NotificationFilters } from './notification.model';

import { NotificationConfig } from './notification.model';

export const getNotifications = async (
  filters: NotificationFilters
): Promise<PaginationResult<Notification>> => {
  const client = useSupabaseClient();

  let query = client
    .from('notifications')
    .select(
      '*, actor:actor_id(id, username, first_name, last_name, image_url)',
      {
        count: 'exact',
      }
    )
    .order('created_at', { ascending: false })
    .limit(NotificationConfig.PAGE_SIZE);

  if (filters.recipientId) {
    query = query.eq('recipient_id', filters.recipientId);
  }

  if (filters.before) {
    query = query.lt('created_at', filters.before);
  }

  const { count, data, error } = await query;

  if (error) throw error;

  return {
    count: count ?? 0,
    data: (data ?? []) as unknown as Notification[],
  };
};

export const getUserNotifications = async (
  userId: string,
  filters: Omit<NotificationFilters, 'recipientId'> = {}
): Promise<PaginationResult<Notification>> => {
  return getNotifications({ ...filters, recipientId: userId });
};

export const markNotificationRead = async (id: string): Promise<void> => {
  const client = useSupabaseClient();

  const { error } = await client
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
    .is('read_at', null);

  if (error) throw error;
};

export const markAllNotificationsRead = async (
  recipientId: string
): Promise<void> => {
  const client = useSupabaseClient();

  const { error } = await client
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('recipient_id', recipientId)
    .is('read_at', null);

  if (error) throw error;
};
