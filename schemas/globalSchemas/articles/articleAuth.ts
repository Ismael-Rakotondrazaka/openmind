import { z } from "zod";
import { SavedArticleSchema } from "~/schemas/globalSchemas/savedArticles/savedArticle";
import { ViewSchema } from "~/schemas/globalSchemas/views";
import { ReactionSchema } from "~/schemas/globalSchemas/reactions";

export const ArticleAuthSchema = z.object({
  _auth: z
    .object({
      savedArticle: SavedArticleSchema.nullable(),
      view: ViewSchema.nullable(),
      reaction: ReactionSchema.nullable(),
    })
    .nullable(),
});

export type ArticleAuth = z.infer<typeof ArticleAuthSchema>;
