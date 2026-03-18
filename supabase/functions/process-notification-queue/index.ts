import '@supabase/functions-js/edge-runtime.d.ts';
import { Hono } from '@hono/hono';

import { serviceSBMiddleware } from '../_shared/middlewares/service-sb.middleware.ts';
import { apiResponse } from '../_shared/utils/responses.ts';
import { processNotificationQueueHandler } from './handlers/index.ts';

const app = new Hono().basePath('/process-notification-queue');

app.options('*', () => apiResponse.options());

app.use('*', serviceSBMiddleware);

app.post('/', ...processNotificationQueueHandler);

Deno.serve(app.fetch);
