import { z } from "zod";

export const CommentCountSchema = z.object({
  _count: z.object({
    replies: z.number().nonnegative().int(),
    reactions: z.number().nonnegative().int(),
  }),
});

export type CommentCount = z.infer<typeof CommentCountSchema>;
