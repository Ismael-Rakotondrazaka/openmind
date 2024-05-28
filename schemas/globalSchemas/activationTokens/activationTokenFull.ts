import { z } from "zod";
import { ActivationTokenSchema } from "~/schemas/globalSchemas/activationTokens/activationToken";
import { UserFilteredSchema } from "~/schemas/globalSchemas/users";

export const ActivationTokenFullSchema = ActivationTokenSchema.merge(
  z.object({
    user: UserFilteredSchema,
  }),
);

export type ActivationTokenFull = z.infer<typeof ActivationTokenFullSchema>;
