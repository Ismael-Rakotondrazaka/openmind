import type { GetUnreadNotificationsCountRequest } from '#shared/features/notifications';

import { EventHandlerBuilder } from '#server/core/requests/eventHandlerBuilder';
import { getUnreadNotificationsCountEventHandlerFn } from '#server/features/notifications/notification.unread-count.handler';

export default defineEventHandler(
  new EventHandlerBuilder<GetUnreadNotificationsCountRequest>().handle(
    getUnreadNotificationsCountEventHandlerFn
  )
);
