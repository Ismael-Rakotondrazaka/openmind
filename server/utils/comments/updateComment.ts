import { z } from "zod";
import { makeContentServerSchema } from "~/server/utils";
import { commentConfig } from "~/utils";

/* -------------------------------------------------------------------------- */
/*                             Update comment body                            */
/* -------------------------------------------------------------------------- */

export const UpdateCommentBodySchema = z.object({
  content: makeContentServerSchema(
    commentConfig.CONTENT_MIN_LENGTH,
    commentConfig.CONTENT_MAX_LENGTH,
  ),
});
