import { z } from "zod";
import { UserFilteredSchema } from "~/schemas/globalSchemas/users/user";
import { PasswordResetTokenSchema } from "~/prisma/generated/zod";

export const PasswordResetTokenFullSchema = PasswordResetTokenSchema.merge(
  z.object({
    user: UserFilteredSchema,
  }),
);

export type PasswordResetTokenFull = z.infer<
  typeof PasswordResetTokenFullSchema
>;
