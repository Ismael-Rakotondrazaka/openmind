import { z } from "zod";
import { SavedArticleSchema, ViewSchema } from "~/prisma/generated/zod";
import { ReactionSchema } from "~/schemas/globalSchemas/reactions/reaction";

export const ArticleAuthSchema = z.object({
  _auth: z.object({
    savedArticle: SavedArticleSchema.nullable(),
    view: ViewSchema.nullable(),
    reaction: ReactionSchema.nullable(),
  }),
});

export type ArticleAuth = z.infer<typeof ArticleAuthSchema>;
