import { z } from "zod";
import { makeContentServerSchema } from "~/server/utils/contents";
import { StoreCommentBodyBaseSchema, commentConfig } from "~/utils";

/* -------------------------------------------------------------------------- */
/*                             Store comment body                             */
/* -------------------------------------------------------------------------- */

export const StoreCommentBodySchema = StoreCommentBodyBaseSchema.merge(
  z.object({
    content: makeContentServerSchema(
      commentConfig.CONTENT_MIN_LENGTH,
      commentConfig.CONTENT_MAX_LENGTH,
    ),
  }),
);
