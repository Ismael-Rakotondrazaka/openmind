import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { destroyNotificationEventHandlerFn } from '#server/features/notifications/notification.destroy.handler';
import {
  type DestroyNotificationRequest,
  NotificationParamsSchema,
} from '#shared/features/notifications';

export default defineEventHandler(
  new EventHandlerBuilder<DestroyNotificationRequest>()
    .params(NotificationParamsSchema)
    .handle(destroyNotificationEventHandlerFn)
);
