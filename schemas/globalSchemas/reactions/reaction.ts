import { z } from "zod";
import {
  type ReactionArticle,
  ReactionArticleSchema,
} from "~/schemas/globalSchemas/reactions/reactionArticle";
import {
  type ReactionComment,
  ReactionCommentSchema,
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
