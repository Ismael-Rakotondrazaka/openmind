import type { RegisterBody } from '#shared/features/auth';

import { randomBytes } from 'node:crypto';

import type {
  UserIdentityModel,
  UserModel,
} from '../../../prisma/generated/client/models';

import { Prisma } from '../../../prisma/generated/client/client';

export type AuthUser = { identities: UserIdentityModel[] } & UserModel;

export const getAuthUserByEmail = async (
  email: string
): Promise<AuthUser | null> => {
  return prisma.user.findFirst({
    include: {
      identities: {
        where: { provider: 'email' },
      },
    },
    where: { deletedAt: null, email },
  }) as Promise<AuthUser | null>;
};

export const registerUser = async (input: RegisterBody): Promise<UserModel> => {
  const hashedPassword = await hashPassword(input.password);

  try {
    return (await prisma.$transaction(async tx => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          firstName: input.firstName ?? null,
          lastName: input.lastName ?? null,
          role: 'user',
          username: input.username ?? null,
        },
      });

      await tx.userIdentity.create({
        data: {
          password: hashedPassword,
          provider: 'email',
          userId: user.id,
        },
      });

      await tx.notificationPreference.createMany({
        data: [
          {
            channel: 'in_app',
            enabled: true,
            groupName: 'comments',
            userId: user.id,
          },
          {
            channel: 'in_app',
            enabled: true,
            groupName: 'follows',
            userId: user.id,
          },
          {
            channel: 'in_app',
            enabled: true,
            groupName: 'reactions',
            userId: user.id,
          },
        ],
      });

      return user;
    })) as UserModel;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const fields = (error.meta?.target as string[] | undefined) ?? [];
      const message = fields.includes('username')
        ? 'auth.signUp.form.errors.username.alreadyTaken'
        : 'auth.signUp.form.errors.email.alreadyTaken';
      throw Exception.badRequest({ data: {}, message });
    }
    throw error;
  }
};

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

export const createEmailVerificationToken = async (
  userId: string,
  options:
    | { pendingEmail: string; type: 'email_change' }
    | { type?: 'signup' } = {}
): Promise<string> => {
  const type = options.type ?? 'signup';
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);
  await prisma.emailVerificationToken.deleteMany({ where: { type, userId } });
  await prisma.emailVerificationToken.create({
    data: {
      expiresAt,
      pendingEmail: 'pendingEmail' in options ? options.pendingEmail : null,
      token,
      type,
      userId,
    },
  });
  return token;
};

export const consumeEmailVerificationToken = async (
  token: string
): Promise<string> => {
  const row = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });
  if (!row) {
    throw Exception.badRequest({
      data: {},
      message: 'auth.confirm.errors.invalidToken',
    });
  }
  if (row.expiresAt < new Date()) {
    await prisma.emailVerificationToken.delete({ where: { token } });
    throw Exception.badRequest({
      data: {},
      message: 'auth.confirm.errors.expiredToken',
    });
  }
  const userUpdate =
    row.type === 'email_change'
      ? { email: row.pendingEmail!, emailVerifiedAt: new Date() }
      : { emailVerifiedAt: new Date() };

  await prisma.$transaction([
    prisma.user.update({
      data: userUpdate,
      where: { id: row.userId },
    }),
    prisma.emailVerificationToken.delete({ where: { token } }),
  ]);
  return row.userId;
};

export const createPasswordResetToken = async (
  email: string
): Promise<null | string> => {
  const user = await prisma.user.findUnique({
    select: { id: true },
    where: { email },
  });
  if (!user) return null;
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.passwordResetToken.create({
    data: { expiresAt, token, userId: user.id },
  });
  return token;
};

export const consumePasswordResetToken = async (
  token: string
): Promise<string> => {
  const row = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!row || row.usedAt) {
    throw Exception.badRequest({
      data: {},
      message: 'auth.passwordReset.errors.invalidToken',
    });
  }
  if (row.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } });
    throw Exception.badRequest({
      data: {},
      message: 'auth.passwordReset.errors.expiredToken',
    });
  }
  await prisma.passwordResetToken.update({
    data: { usedAt: new Date() },
    where: { token },
  });
  return row.userId;
};
