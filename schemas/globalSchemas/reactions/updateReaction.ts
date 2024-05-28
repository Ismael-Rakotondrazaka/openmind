import { z } from "zod";
import { ReactionTypeSchema } from "~/prisma/generated/zod";
import { ReactionFullSchema } from "~/schemas/globalSchemas/reactions/reaction";

/* -------------------------------------------------------------------------- */
/*                            Update reaction param                           */
/* -------------------------------------------------------------------------- */

export const UpdateReactionParamSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export type UpdateReactionParam = z.infer<typeof UpdateReactionParamSchema>;

/* -------------------------------------------------------------------------- */
/*                            Update reaction body                            */
/* -------------------------------------------------------------------------- */

export const UpdateReactionBodySchema = z.object({
  type: ReactionTypeSchema,
});

export type UpdateReactionBody = z.infer<typeof UpdateReactionBodySchema>;

export type UpdateReactionBodyPEM = RequestErrorMessage<UpdateReactionBody>;

/* -------------------------------------------------------------------------- */
/*                            Update reaction data                            */
/* -------------------------------------------------------------------------- */

export const UpdateReactionDataSchema = z.object({
  reaction: ReactionFullSchema,
});

export type UpdateReactionData = z.infer<typeof UpdateReactionDataSchema>;

export type UpdateReactionError =
  | BadRequestError<UpdateReactionBodyPEM>
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError;
