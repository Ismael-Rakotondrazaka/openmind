import type { User } from '../users/user.model';

export const NotificationTypes = [
  'comment_reacted',
  'comment_replied',
  'post_commented',
  'post_reacted',
  'user_followed',
  'user_welcomed',
] as const;

export const NotificationType = createEnumConstants(NotificationTypes);

export type Notification = {
  actor: NotificationActor | null;
  data: NotificationData;
  type: NotificationType;
} & Omit<Tables<'notifications'>, 'data' | 'type'>;

export type NotificationActor = Pick<
  User,
  'first_name' | 'id' | 'image_url' | 'last_name' | 'username'
>;

export type NotificationData = {
  actor_count?: number;
  comment_id?: string;
  parent_comment_id?: string;
  post_author_username?: string;
  post_id?: string;
  post_slug?: string;
  reaction_type?: string;
};

export type NotificationFilters = {
  before?: string;
  recipientId?: string;
};

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationConfig = {
  PAGE_SIZE: 20,
} as const;
