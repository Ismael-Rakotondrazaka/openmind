import { z } from "zod";

export const PasswordResetTokenSchema = z.object({
  token: z.string(),
  expiresAt: z.coerce.date(),
  userId: z.number().int(),
});
