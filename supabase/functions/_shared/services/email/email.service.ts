import { getEnv } from '../../utils/getEnv.ts';

export const EmailTemplate = {
  WELCOME: 'WELCOME',
} as const;

export type EmailTemplate = keyof typeof EmailTemplate;

export const EmailTemplateBrevoId: Record<EmailTemplate, number> = {
  WELCOME: 3,
};

export interface EmailSendResult {
  error?: string;
  messageId?: string;
  sentAt: Date;
  success: boolean;
}

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export type SendBrevoTemplateOptions = {
  logMetadata?: null | Record<string, unknown>;
  params?: Record<string, boolean | number | string | undefined>;
  template: EmailTemplate;
  to: { email: string; name?: string };
};

export type WelcomeEmailData = {
  appUrl: string;
  email: string;
};

export async function sendBrevoTemplateEmail(
  options: SendBrevoTemplateOptions
): Promise<EmailSendResult> {
  const { logMetadata, params, template, to } = options;
  const apiKey = getEnv('BREVO_API_KEY');
  const sentAt = new Date();

  const templateId = EmailTemplateBrevoId[template];

  const body: Record<string, unknown> = {
    templateId,
    to: [{ email: to.email, name: to.name ?? to.email }],
  };

  if (params && Object.keys(params).length > 0) {
    const filteredParams: Record<string, boolean | number | string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null)
        filteredParams[k] = v as boolean | number | string;
    }
    if (Object.keys(filteredParams).length > 0) body.params = filteredParams;
  }

  try {
    const res = await fetch(BREVO_API_URL, {
      body: JSON.stringify(body),
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!res.ok) {
      const text = await res.text();
      const errorMsg = `Brevo API ${res.status}: ${text}`;

      return {
        error: errorMsg,
        sentAt,
        success: false,
      };
    }

    const data = (await res.json()) as { messageId?: string };
    const result: EmailSendResult = { sentAt, success: true };
    if (data.messageId) result.messageId = data.messageId;
    const metadata: Record<string, unknown> = { ...(logMetadata ?? {}) };
    if (data.messageId) metadata.messageId = data.messageId;

    return result;
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : 'Failed to send email';

    return {
      error: errorMsg,
      sentAt,
      success: false,
    };
  }
}

export function sendWelcomeEmail(
  data: WelcomeEmailData
): Promise<EmailSendResult> {
  return sendBrevoTemplateEmail({
    params: { appUrl: data.appUrl },
    template: EmailTemplate.WELCOME,
    to: { email: data.email },
  });
}
