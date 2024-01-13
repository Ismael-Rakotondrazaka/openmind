import type { Tag } from "@prisma/client";
import { z } from "zod";
import { tagConfig } from "~/utils/configs";

export const StoreTagBodySchema = z.object({
  value: z.string().trim().min(1).max(tagConfig.VALUE_MAX_LENGTH).toLowerCase(),
});

export type StoreTagBody = z.infer<typeof StoreTagBodySchema>;

export type StoreTagBodyPEM = RequestErrorMessage<StoreTagBody>;

export type StoreTagData = {
  tag: Tag;
};

export type StoreTagError =
  | BadRequestError<StoreTagBodyPEM>
  | UnauthorizedError;
