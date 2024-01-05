import { z } from "zod";

export const roleSchema = z.enum(["admin", "modo", "user"]);

export const userSchema = z.object({
  role: roleSchema,
  id: z.number().int(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  profileUrl: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});
