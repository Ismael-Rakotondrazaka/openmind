import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { updateNotificationPreferenceEventHandlerFn } from '#server/features/notifications/notification.preferences.update.handler';
import {
  UpdateNotificationPreferenceBodySchema,
  type UpdateNotificationPreferenceRequest,
} from '#shared/features/notifications';

export default defineEventHandler(
  new EventHandlerBuilder<UpdateNotificationPreferenceRequest>()
    .body(UpdateNotificationPreferenceBodySchema)
    .handle(updateNotificationPreferenceEventHandlerFn)
);
