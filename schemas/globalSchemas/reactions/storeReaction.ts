import { z } from "zod";
import { ReactionSchema } from "~/schemas/globalSchemas/reactions/reaction";
import { UserSchema } from "~/schemas/globalSchemas/users";
import { CustomNullSchema } from "~/schemas/globalSchemas/types";
import { ReactionTypeSchema } from "~/schemas/globalSchemas/reactions/reactionType";

/* -------------------------------------------------------------------------- */
/*                             Store reaction body                            */
/* -------------------------------------------------------------------------- */

export const StoreReactionBodySchema = z.object({
  type: ReactionTypeSchema,
  articleId: z.union([z.string().trim(), CustomNullSchema]).optional(),
  commentId: z.union([z.string().trim(), CustomNullSchema]).optional(),
});

export type StoreReactionBody = z.infer<typeof StoreReactionBodySchema>;

export type StoreReactionBodyPEM = RequestErrorMessage<StoreReactionBody>;

/* -------------------------------------------------------------------------- */
/*                             Store reaction data                            */
/* -------------------------------------------------------------------------- */

export const StoreReactionDataSchema = z.object({
  reaction: ReactionSchema.and(
    z.object({
      user: UserSchema,
    }),
  ),
});

export type StoreReactionData = z.infer<typeof StoreReactionDataSchema>;

/* -------------------------------------------------------------------------- */
/*                            Store reaction error                            */
/* -------------------------------------------------------------------------- */

export type StoreReactionError =
  | BadRequestError<StoreReactionBodyPEM>
  | UnauthorizedError;