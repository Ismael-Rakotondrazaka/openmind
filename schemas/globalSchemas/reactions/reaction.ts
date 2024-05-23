import { z } from "zod";
import {
  ReactionArticleSchema,
  type ReactionArticle,
} from "~/schemas/globalSchemas/reactions/reactionArticle";
import {
  ReactionCommentSchema,
  type ReactionComment,
} from "~/schemas/globalSchemas/reactions/reactionComment";
import { UserFilteredSchema } from "~/schemas/globalSchemas/users/user";

export const ReactionSchema: z.ZodType<ReactionArticle | ReactionComment> =
  z.lazy(() => z.union([ReactionArticleSchema, ReactionCommentSchema]));

export type Reaction = z.infer<typeof ReactionSchema>;

export const ReactionFullSchema = ReactionSchema.and(
  z.object({
    user: UserFilteredSchema,
  }),
);

export type ReactionFull = z.infer<typeof ReactionFullSchema>;
