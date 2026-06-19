import { useQueryCache } from '@pinia/colada';
import { WsNotificationMessageType } from '#shared/features/notifications';
import { watch } from 'vue';

import { NOTIFICATION_QUERY_KEYS } from '../notification.query';

export const useNotificationRealtime = () => {
  const { data } = useGlobalWs();
  const queryCache = useQueryCache();

  watch(data, raw => {
    if (!raw || raw === 'pong') return;
    try {
      const msg = JSON.parse(raw as string) as { type?: string };
      if (msg.type === WsNotificationMessageType) {
        queryCache.invalidateQueries({ key: NOTIFICATION_QUERY_KEYS.root });
      }
    } catch {
      // ignore malformed messages
    }
  });
};
