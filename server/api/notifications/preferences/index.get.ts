import type { IndexNotificationPreferencesRequest } from '#shared/features/notifications';

import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { indexNotificationPreferencesEventHandlerFn } from '#server/features/notifications/notification.preferences.index.handler';

export default defineEventHandler(
  new EventHandlerBuilder<IndexNotificationPreferencesRequest>().handle(
    indexNotificationPreferencesEventHandlerFn
  )
);
