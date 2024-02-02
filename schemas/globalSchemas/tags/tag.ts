import { z } from "zod";

export const TagSchema = z.object({
  id: z.number().int(),
  value: z.string(),
});

export type Tag = z.infer<typeof TagSchema>;
