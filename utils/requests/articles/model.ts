import { z } from "zod";

export const articleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  userId: z.number().int(),
  summary: z.string().nullable(),
  content: z.string(),
  isVisible: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});
