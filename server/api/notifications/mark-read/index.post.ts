import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { markNotificationsReadEventHandlerFn } from '#server/features/notifications/notification.mark-read.handler';
import {
  MarkNotificationsReadBodySchema,
  type MarkNotificationsReadRequest,
} from '#shared/features/notifications';

export default defineEventHandler(
  new EventHandlerBuilder<MarkNotificationsReadRequest>()
    .body(MarkNotificationsReadBodySchema)
    .handle(markNotificationsReadEventHandlerFn)
);
