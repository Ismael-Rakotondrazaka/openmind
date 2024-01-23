import { z } from "zod";
import { ReactionSchema, UserSchema } from "~/utils/schemas";

/* -------------------------------------------------------------------------- */
/*                           Destroy reaction param                           */
/* -------------------------------------------------------------------------- */

export const DestroyReactionParamSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export type DestroyReactionParam = z.infer<typeof DestroyReactionParamSchema>;

/* -------------------------------------------------------------------------- */
/*                            Destroy reaction data                           */
/* -------------------------------------------------------------------------- */

export const DestroyReactionDataSchema = z.object({
  reaction: ReactionSchema.and(
    z.object({
      user: UserSchema,
    }),
  ),
});

export type DestroyReactionData = z.infer<typeof DestroyReactionDataSchema>;

/* -------------------------------------------------------------------------- */
/*                           Destroy reaction error                           */
/* -------------------------------------------------------------------------- */

export type DestroyReactionError =
  | NotFoundError
  | UnauthorizedError
  | ForbiddenError;
