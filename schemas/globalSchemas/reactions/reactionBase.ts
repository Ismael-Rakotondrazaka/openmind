import { z } from "zod";
import { ReactionTypeSchema } from "~/prisma/generated/zod";

export const ReactionBaseSchema = z.object({
  type: ReactionTypeSchema,
  id: z.number().int(),
  createdAt: z.coerce.date(),
  userId: z.number().int(),
});
