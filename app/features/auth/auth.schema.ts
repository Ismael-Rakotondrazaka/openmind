import { z } from 'zod';

export const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginBody = z.infer<typeof LoginBodySchema>;

export const RegisterBodySchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  password: z.string().min(8),
  username: z.string().trim().min(1),
});

export type RegisterBody = z.infer<typeof RegisterBodySchema>;

export const PasswordResetBodySchema = z.object({
  email: z.string().email(),
});

export type PasswordResetBody = z.infer<typeof PasswordResetBodySchema>;

export const PasswordUpdateBodySchema = z.object({
  password: z.string().min(8),
});

export type PasswordUpdateBody = z.infer<typeof PasswordUpdateBodySchema>;
