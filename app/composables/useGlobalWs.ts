import { createSharedComposable, useWebSocket } from '@vueuse/core';

export const useGlobalWs = createSharedComposable(() => {
  const { close, data, open, send, status } = useWebSocket('/ws', {
    autoReconnect: {
      delay: (retries: number) => Math.min(1000 * 2 ** retries, 30000),
      retries: -1,
    },
    heartbeat: {
      message: 'ping',
      pongTimeout: 5000,
      responseMessage: 'pong',
    },
    immediate: false,
  });

  return { close, data, open, send, status };
});
