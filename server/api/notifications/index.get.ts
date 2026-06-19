import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { indexNotificationsEventHandlerFn } from '#server/features/notifications/notification.index.handler';
import {
  IndexNotificationsQuerySchema,
  type IndexNotificationsRequest,
} from '#shared/features/notifications';

export default defineEventHandler(
  new EventHandlerBuilder<IndexNotificationsRequest>()
    .query(IndexNotificationsQuerySchema)
    .handle(indexNotificationsEventHandlerFn)
);
