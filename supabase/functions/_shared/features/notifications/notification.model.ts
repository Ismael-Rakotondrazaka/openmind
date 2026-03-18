import { createEnumConstants } from '../../utils/enums.ts';

export const NotificationTypes = [
  'comment_reacted',
  'comment_replied',
  'post_commented',
  'post_reacted',
  'user_followed',
  'user_welcomed',
] as const;

export const NotificationType = createEnumConstants(NotificationTypes);

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];
