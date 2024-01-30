import { z } from "zod";

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  userId: z.coerce.number().int(),
  summary: z.string().nullable(),
  content: z.string(),
  coverUrl: z.string().nullable(),
  isVisible: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export type Article = z.infer<typeof ArticleSchema>;

export const ArticleFullSchema = ArticleSchema.and(
  z.object({
    user: UserSchema,
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
