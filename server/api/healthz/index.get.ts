import type { H3Event } from 'h3';

const startupTime = new Date();

const handler = eventHandler(async (event: H3Event) => {
  const runtimeConfig = useRuntimeConfig(event);

  return {
    appVersion: runtimeConfig.public.appVersion || 'unknown',
    baseUrl: runtimeConfig.public.appUrl,
    startupTime,
    status: 'healthy',
    time: new Date(),
  };
});

export type HealthCheckData = Awaited<ReturnType<typeof handler>>;
export default handler;
