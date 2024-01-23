import { z } from "zod";
import {
  UserSchema,
  ReactionTypeSchema,
  ReactionSchema,
} from "~/utils/schemas";

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
  reaction: ReactionSchema.and(
    z.object({
      user: UserSchema,
    }),
  ),
});

export type UpdateReactionData = z.infer<typeof UpdateReactionDataSchema>;

export type UpdateReactionError =
  | BadRequestError<UpdateReactionBodyPEM>
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError;
