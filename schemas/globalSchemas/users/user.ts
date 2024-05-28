import { z } from "zod";
import { RoleSchema } from "~/prisma/generated/zod";

export const UserFilteredSchema = z.object({
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

export type UserFiltered = z.infer<typeof UserFilteredSchema>;
