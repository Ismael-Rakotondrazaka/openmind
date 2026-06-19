import { z } from 'zod';

export const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginBody = z.infer<typeof LoginBodySchema>;

export const RegisterBodySchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  password: z.string().min(8),
  username: z.string().min(3).optional(),
});

export type RegisterBody = z.infer<typeof RegisterBodySchema>;

export const ConfirmQuerySchema = z.object({
  token: z.string().min(1),
});

export type ConfirmQuery = z.infer<typeof ConfirmQuerySchema>;

export const ConfirmResendBodySchema = z.object({
  email: z.string().email(),
});

export type ConfirmResendBody = z.infer<typeof ConfirmResendBodySchema>;

export const PasswordResetBodySchema = z.object({
  email: z.string().email(),
});

export type PasswordResetBody = z.infer<typeof PasswordResetBodySchema>;

export const PasswordResetConfirmBodySchema = z.object({
  password: z.string().min(8),
  token: z.string().min(1),
});

export type PasswordResetConfirmBody = z.infer<
  typeof PasswordResetConfirmBodySchema
>;

export const PasswordUpdateBodySchema = z.object({
  password: z.string().min(8),
});

export type PasswordUpdateBody = z.infer<typeof PasswordUpdateBodySchema>;

export const EmailUpdateBodySchema = z.object({
  email: z.string().email(),
});

export type EmailUpdateBody = z.infer<typeof EmailUpdateBodySchema>;
