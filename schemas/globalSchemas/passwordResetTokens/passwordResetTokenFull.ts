import { z } from "zod";
import { PasswordResetTokenSchema } from "~/prisma/generated/zod";
import { UserFilteredSchema } from "~/schemas/globalSchemas/users/user";

export const PasswordResetTokenFullSchema = PasswordResetTokenSchema.merge(
  z.object({
    user: UserFilteredSchema,
  }),
);

export type PasswordResetTokenFull = z.infer<
  typeof PasswordResetTokenFullSchema
>;
