import type { Tag } from "@prisma/client";
import { z } from "zod";
import { userConfig } from "~/configs";

/* -------------------------------------------------------------------------- */
/*                             Update userTag body                            */
/* -------------------------------------------------------------------------- */

export const UpdateUserTagBodySchema = z.object({
  tagIds: z
    .array(z.coerce.number().int().positive())
    .min(userConfig.TAGS_MIN_SIZE)
    .max(userConfig.TAGS_MAX_SIZE)
    .refine((val: number[]) => val.length === [...new Set(val)].length, {
      message: "Tags must be unique.",
    }),
});

export type UpdateUserTagBody = z.infer<typeof UpdateUserTagBodySchema>;

export type UpdateUserTagBodyPEM = RequestErrorMessage<UpdateUserTagBody>;

/* -------------------------------------------------------------------------- */
/*                             Index userTag data                             */
/* -------------------------------------------------------------------------- */

export type UpdateUserTagData = {
  tags: Tag[];
};

/* -------------------------------------------------------------------------- */
/*                             Index userTag error                            */
/* -------------------------------------------------------------------------- */

export type UpdateUserTagError =
  | BadRequestError<UpdateUserTagBodyPEM>
  | UnauthorizedError;
