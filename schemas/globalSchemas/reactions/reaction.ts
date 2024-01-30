import { z } from "zod";
import { UserSchema } from "~/schemas/globalSchemas/users";
import { ReactionTypeSchema } from "~/schemas/globalSchemas/reactions/reactionType";
import type { ReactionArticle } from "~/schemas/globalSchemas/reactions/reactionArticle";
import type { ReactionComment } from "~/schemas/globalSchemas/reactions/reactionComment";

export const ReactionBaseSchema = z.object({
  type: ReactionTypeSchema,
  id: z.number().int(),
  createdAt: z.coerce.date(),
  userId: z.number().int(),
});

export const ReactionSchema: z.ZodType<ReactionArticle | ReactionComment> =
  z.lazy(() => z.union([ReactionArticleSchema, ReactionCommentSchema]));

export type Reaction = z.infer<typeof ReactionSchema>;

export const ReactionFullSchema = ReactionSchema.and(
  z.object({
    user: UserSchema,
  }),
);

export type ReactionFull = z.infer<typeof ReactionFullSchema>;
