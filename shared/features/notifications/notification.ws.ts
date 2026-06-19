import type { WsEvent } from '../../utils/ws';
import type { NotificationModel } from './notification.model';

export const WsNotificationMessageType = 'notification' as const;

export const notificationsTopic = (userId: string) => `user:${userId}:notifications`;

export type WsNotificationMessage = {
  event: WsEvent;
  record: NotificationModel;
  type: typeof WsNotificationMessageType;
};
