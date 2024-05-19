import { z } from "zod";
import { PasswordResetTokenSchema } from "~/schemas/globalSchemas/passwordResetTokens/passwordResetToken";
import { UserSchema } from "~/schemas/globalSchemas/users";

export const PasswordResetTokenFullSchema = PasswordResetTokenSchema.merge(
  z.object({
    user: UserSchema,
  }),
);

export type PasswordResetTokenFull = z.infer<
  typeof PasswordResetTokenFullSchema
>;
