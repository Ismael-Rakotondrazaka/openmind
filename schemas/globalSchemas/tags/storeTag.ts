import type { Tag } from "@prisma/client";
import { z } from "zod";
import { tagConfig } from "~/configs";

/* -------------------------------------------------------------------------- */
/*                               Store tag body                               */
/* -------------------------------------------------------------------------- */

export const StoreTagBodySchema = z.object({
  value: z.string().trim().min(1).max(tagConfig.VALUE_MAX_LENGTH).toLowerCase(),
});

export type StoreTagBody = z.infer<typeof StoreTagBodySchema>;

export type StoreTagBodyPEM = RequestErrorMessage<StoreTagBody>;

/* -------------------------------------------------------------------------- */
/*                               Store tag data                               */
/* -------------------------------------------------------------------------- */

export type StoreTagData = {
  tag: Tag;
};

/* -------------------------------------------------------------------------- */
/*                               Store tag error                              */
/* -------------------------------------------------------------------------- */

export type StoreTagError =
  | BadRequestError<StoreTagBodyPEM>
  | UnauthorizedError;
