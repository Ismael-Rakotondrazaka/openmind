import { z } from "zod";
import { ActivationTokenSchema } from "~/schemas/globalSchemas/activationTokens/activationToken";
import { UserSchema } from "~/schemas/globalSchemas/users";

export const ActivationTokenFullSchema = ActivationTokenSchema.merge(
  z.object({
    user: UserSchema,
  }),
);

export type ActivationTokenFull = z.infer<typeof ActivationTokenFullSchema>;
