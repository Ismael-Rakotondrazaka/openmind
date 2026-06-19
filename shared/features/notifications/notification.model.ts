import type {
  NotificationModel,
  NotificationPreferenceModel,
} from '../../../prisma/generated/client/models';
import type { UserProfile } from '../users/user.model';

export type { NotificationModel, NotificationPreferenceModel };

export type NotificationData = {
  actorCount?: number;
  commentId?: string;
  parentCommentId?: string;
  postAuthorUsername?: string;
  postId?: string;
  postSlug?: string;
  reactionType?: string;
};

export type NotificationWithActor = {
  actorUser: null | UserProfile;
  data: NotificationData;
} & Omit<NotificationModel, 'data'>;

export const NotificationType = {
  comment_reacted: 'comment_reacted',
  comment_replied: 'comment_replied',
  post_commented: 'post_commented',
  post_reacted: 'post_reacted',
  user_followed: 'user_followed',
  user_welcomed: 'user_welcomed',
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationGroup = {
  comments: 'comments',
  follows: 'follows',
  reactions: 'reactions',
} as const;

export type NotificationGroup =
  (typeof NotificationGroup)[keyof typeof NotificationGroup];

export const NotificationChannel = {
  in_app: 'in_app',
} as const;

export type Notification = NotificationWithActor;

export type NotificationChannel =
  (typeof NotificationChannel)[keyof typeof NotificationChannel];

export const NotificationTypes = [
  'comment_reacted',
  'comment_replied',
  'post_commented',
  'post_reacted',
  'user_followed',
  'user_welcomed',
] as const;
