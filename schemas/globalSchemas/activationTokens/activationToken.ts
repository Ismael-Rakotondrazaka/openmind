import { z } from "zod";

export const ActivationTokenSchema = z.object({
  token: z.string(),
  expiresAt: z.coerce.date(),
  userId: z.coerce.number().positive().int(),
});
