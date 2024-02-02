import { z } from "zod";

export const ViewSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.number().int(),
  articleId: z.string(),
});

export type View = z.infer<typeof ViewSchema>;
