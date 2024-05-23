import { z } from "zod";
import { CommentSchema } from "~/prisma/generated/zod";
import { CommentAuthSchema } from "~/schemas/globalSchemas/comments/commentAuth";
import { CommentCountSchema } from "~/schemas/globalSchemas/comments/commentCount";
import { UserFilteredSchema } from "~/schemas/globalSchemas/users/user";

export const CommentFullSchema = CommentSchema.merge(
  z.object({
    user: UserFilteredSchema,
  }),
)
  .merge(CommentCountSchema)
  .merge(CommentAuthSchema);

export type CommentFull = z.infer<typeof CommentFullSchema>;
