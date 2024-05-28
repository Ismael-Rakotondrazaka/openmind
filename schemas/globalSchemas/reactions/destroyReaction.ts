import { z } from "zod";
import { ReactionFullSchema } from "~/schemas/globalSchemas/reactions/reaction";

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
  reaction: ReactionFullSchema,
});

export type DestroyReactionData = z.infer<typeof DestroyReactionDataSchema>;

/* -------------------------------------------------------------------------- */
/*                           Destroy reaction error                           */
/* -------------------------------------------------------------------------- */

export type DestroyReactionError =
  | NotFoundError
  | UnauthorizedError
  | ForbiddenError;
