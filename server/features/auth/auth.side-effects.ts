import {
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from '#server/utils/brevo';

import {
  createEmailVerificationToken,
  createPasswordResetToken,
} from './auth.service';

export const onUserRegistered = async (
  userId: string,
  email: string,
  locale?: string
): Promise<void> => {
  const {
    public: { appUrl },
  } = useRuntimeConfig();

  await Promise.allSettled([
    sendWelcomeEmail({ appUrl, email }),
    prisma.notificationQueue.create({
      data: {
        channels: ['in_app'],
        data: {},
        recipientId: userId,
        type: 'user_welcomed',
      },
    }),
    onEmailVerificationRequested(userId, email, {}, locale),
  ]);
};

export const onEmailVerificationRequested = async (
  userId: string,
  email: string,
  options:
    | { pendingEmail: string; type: 'email_change' }
    | { type?: 'signup' } = {},
  locale = 'fr'
): Promise<void> => {
  const {
    public: { appUrl },
  } = useRuntimeConfig();

  const token = await createEmailVerificationToken(userId, options);
  const verificationUrl = `${appUrl}/${locale}/confirm?token=${token}`;
  void sendEmailVerificationEmail({ email, verificationUrl });
};

export const onPasswordResetRequested = async (
  email: string,
  locale = 'fr'
): Promise<void> => {
  const {
    public: { appUrl },
  } = useRuntimeConfig();

  const token = await createPasswordResetToken(email);
  if (token) {
    const resetUrl = `${appUrl}/${locale}/password/update?token=${token}`;
    void sendPasswordResetEmail({ email, resetUrl });
  }
};
