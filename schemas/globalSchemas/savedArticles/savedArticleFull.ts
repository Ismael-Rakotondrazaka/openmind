import { z } from "zod";

import { SavedArticleSchema } from "~/prisma/generated/zod";
import { ArticleFullSchema } from "~/schemas/globalSchemas/articles/article";

export const SavedArticleFullSchema = SavedArticleSchema.and(
  z.object({
    article: ArticleFullSchema,
  }),
);

export type SavedArticleFull = z.infer<typeof SavedArticleFullSchema>;
