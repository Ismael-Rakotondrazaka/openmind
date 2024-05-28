import { z } from "zod";
import { ArticleSchema, TagSchema } from "~/prisma/generated/zod";
import { ArticleAuthSchema } from "~/schemas/globalSchemas/articles/articleAuth";
import { ArticleCountSchema } from "~/schemas/globalSchemas/articles/articleCount";
import { UserFilteredSchema } from "~/schemas/globalSchemas/users";

export const ArticleFullSchema = ArticleSchema.and(
  z.object({
    user: UserFilteredSchema,
  }),
)
  .and(
    z.object({
      tags: z.array(TagSchema),
    }),
  )
  .and(ArticleCountSchema)
  .and(ArticleAuthSchema);

export type ArticleFull = z.infer<typeof ArticleFullSchema>;
