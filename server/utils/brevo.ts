export const EmailTemplate = {
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  PASSWORD_RESET: 'PASSWORD_RESET',
  WELCOME: 'WELCOME',
} as const;

export type EmailTemplate = keyof typeof EmailTemplate;

export const EmailTemplateBrevoId: Record<EmailTemplate, number> = {
  EMAIL_VERIFICATION: 11,
  PASSWORD_RESET: 12,
  WELCOME: 3,
};

export interface EmailSendResult {
  error?: string;
  messageId?: string;
  sentAt: Date;
  success: boolean;
}

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

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export type EmailVerificationData = {
  email: string;
  verificationUrl: string;
};

export type PasswordResetData = {
  email: string;
  resetUrl: string;
};

export async function sendBrevoTemplateEmail(
  options: SendBrevoTemplateOptions
): Promise<EmailSendResult> {
  const { logMetadata, params, template, to } = options;
  const {
    brevo: { apiKey },
  } = useRuntimeConfig();
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

export function sendEmailVerificationEmail(
  data: EmailVerificationData
): Promise<EmailSendResult> {
  return sendBrevoTemplateEmail({
    params: { verificationUrl: data.verificationUrl },
    template: EmailTemplate.EMAIL_VERIFICATION,
    to: { email: data.email },
  });
}

export function sendPasswordResetEmail(
  data: PasswordResetData
): Promise<EmailSendResult> {
  return sendBrevoTemplateEmail({
    params: { resetUrl: data.resetUrl },
    template: EmailTemplate.PASSWORD_RESET,
    to: { email: data.email },
  });
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
