import type { Request } from '../../utils/request';
import type { PaginationResult } from '../paginations';
import type {
  NotificationModel,
  NotificationPreferenceModel,
  NotificationWithActor,
} from './notification.model';
import type {
  IndexNotificationsQuery,
  MarkNotificationsReadBody,
  NotificationParams,
  UpdateNotificationPreferenceBody,
} from './notification.schema';

export type DestroyNotificationData = { data: NotificationModel };
export type DestroyNotificationRequest = Request<
  DestroyNotificationData,
  Record<string, never>,
  NotificationParams
>;

export type GetUnreadNotificationsCountData = { count: number };

export type GetUnreadNotificationsCountRequest =
  Request<GetUnreadNotificationsCountData>;
export type IndexNotificationPreferencesRequest = Request<
  NotificationPreferenceModel[]
>;

export type IndexNotificationsData = {
  unreadCount: number;
} & PaginationResult<NotificationWithActor>;

export type IndexNotificationsRequest = Request<
  IndexNotificationsData,
  Record<string, never>,
  Record<string, never>,
  IndexNotificationsQuery
>;
export type MarkNotificationsReadRequest = Request<
  { count: number },
  MarkNotificationsReadBody
>;

export type UpdateNotificationPreferenceData = {
  data: NotificationPreferenceModel;
};
export type UpdateNotificationPreferenceRequest = Request<
  UpdateNotificationPreferenceData,
  UpdateNotificationPreferenceBody
>;
