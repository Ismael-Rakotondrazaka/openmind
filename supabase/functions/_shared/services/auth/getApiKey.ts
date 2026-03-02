import type { HonoRequest } from '@hono/hono';

/**
 * Get the API key from the request headers.
 */
export const getApiKey = (req: HonoRequest): null | string => {
  const apiKeyHeader = req.header('Apikey');

  return apiKeyHeader || null;
};
