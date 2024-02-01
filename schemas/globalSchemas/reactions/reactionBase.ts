import { z } from "zod";
import { ReactionTypeSchema } from "~/schemas/globalSchemas/reactions/reactionType";

export const ReactionBaseSchema = z.object({
  type: ReactionTypeSchema,
  id: z.number().int(),
  createdAt: z.coerce.date(),
  userId: z.number().int(),
});
