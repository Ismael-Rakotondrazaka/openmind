import { z } from "zod";
import { ReactionFullSchema } from "~/schemas/globalSchemas/reactions/reaction";

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
  reaction: ReactionFullSchema,
});

export type ShowReactionData = z.infer<typeof ShowReactionDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Show reaction error                            */
/* -------------------------------------------------------------------------- */

export type ShowReactionError = NotFoundError;
