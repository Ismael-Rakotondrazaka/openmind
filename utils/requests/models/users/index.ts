import { z } from "zod";
import { RoleSchema } from "../roles";

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.number().int(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  profileUrl: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});
