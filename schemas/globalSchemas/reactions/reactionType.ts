import { z } from "zod";

export const ReactionTypeSchema = z.enum(["like", "love", "celebrate"]);

export type ReactionType = z.infer<typeof ReactionTypeSchema>;
