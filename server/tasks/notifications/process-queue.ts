import { logger } from '#server/core/loggers/logger';
import { processNotificationQueue } from '#server/features/notifications/notification.repository';

export default defineTask({
  meta: {
    description: 'Process pending notification queue items',
    name: 'notifications:process-queue',
  },
  async run() {
    try {
      await processNotificationQueue();
      return { result: 'ok' };
    } catch (error) {
      logger.error('[task:notifications:process-queue] Failed', error);
      throw error;
    }
  },
});
