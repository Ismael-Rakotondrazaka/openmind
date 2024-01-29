import { z } from "zod";
import { ReactionSchema } from "~/schemas/globalSchemas/reactions/reaction";
import { UserSchema } from "~/schemas/globalSchemas/users";

/* -------------------------------------------------------------------------- */
/*                             Show reaction param                            */
/* -------------------------------------------------------------------------- */

export const ShowReactionParamSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export type ShowReactionParam = z.infer<typeof ShowReactionParamSchema>;

/* -------------------------------------------------------------------------- */
/*                             Show reaction data                             */
/* -------------------------------------------------------------------------- */

export const ShowReactionDataSchema = z.object({
  reaction: ReactionSchema.and(
    z.object({
      user: UserSchema,
    }),
  ),
});

export type ShowReactionData = z.infer<typeof ShowReactionDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Show reaction error                            */
/* -------------------------------------------------------------------------- */

export type ShowReactionError = NotFoundError;
