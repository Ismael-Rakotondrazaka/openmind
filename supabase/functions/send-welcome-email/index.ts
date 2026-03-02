import '@supabase/functions-js/edge-runtime.d.ts';
import { Hono } from '@hono/hono';

import { serviceSBMiddleware } from '../_shared/middlewares/service-sb.middleware.ts';
import { apiResponse } from '../_shared/utils/responses.ts';
import { sendWelcomeEmailHandler } from './handlers/index.ts';

const app = new Hono().basePath('/send-welcome-email');

app.options('*', () => apiResponse.options());

app.use('*', serviceSBMiddleware);

app.post('/', ...sendWelcomeEmailHandler);

Deno.serve(app.fetch);
