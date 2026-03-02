import { createFactory } from '@hono/hono/factory';
import { z } from 'zod';

import type { ServiceSBClientProviderContextVariables } from '../../_shared/middlewares/service-sb-client-provider.middleware.ts';

import { sendWelcomeEmail } from '../../_shared/services/email/email.service.ts';
import { getEnv } from '../../_shared/utils/getEnv.ts';
import { validateRequestBody } from '../../_shared/utils/requests.ts';
import { apiResponse } from '../../_shared/utils/responses.ts';

type Variables = ServiceSBClientProviderContextVariables;

const factory = createFactory<{ Variables: Variables }>();

const SendWelcomeEmailBody = z.object({
  email: z.string().email(),
  userId: z.string(),
});

export const sendWelcomeEmailHandler = factory.createHandlers(
  async ({ req }) => {
    const body = await validateRequestBody(SendWelcomeEmailBody, req);

    if (!body.success) {
      return body.response;
    }

    await sendWelcomeEmail({
      appUrl: getEnv('APP_URL'),
      email: body.data.email,
    });

    return apiResponse.accepted({
      message: 'Email sent successfully',
      success: true,
    });
  }
);
