import { z } from "zod";

export const UserCountSchema = z.object({
  _count: z.object({
    tags: z.number().nonnegative().int(),
    followers: z.number().nonnegative().int(),
    following: z.number().nonnegative().int(),
    articles: z.number().nonnegative().int(),
  }),
});
