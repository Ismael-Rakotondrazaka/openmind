import { z } from "zod";

export const ArticleCountSchema = z.object({
  _count: z.object({
    views: z.number().nonnegative().int(),
    tags: z.number().nonnegative().int(),
    comments: z.number().nonnegative().int(),
    reactions: z.number().nonnegative().int(),
  }),
});

export type ArticleCount = z.infer<typeof ArticleCountSchema>;
