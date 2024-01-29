import { z } from "zod";
import { RoleSchema } from "~/schemas/globalSchemas/roles";

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.coerce.number().int(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  profileUrl: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export type User = z.infer<typeof UserSchema>;
