import { z } from "zod";
import { FollowFullSchema } from "~/schemas/globalSchemas/follows/follow";

/* -------------------------------------------------------------------------- */
/*                              Show follow param                             */
/* -------------------------------------------------------------------------- */

export const ShowFollowParamSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export type ShowFollowParam = z.infer<typeof ShowFollowParamSchema>;

/* -------------------------------------------------------------------------- */
/*                              Show follow data                              */
/* -------------------------------------------------------------------------- */

export const ShowFollowDataSchema = z.object({
  follow: FollowFullSchema,
});

export type ShowFollowData = z.infer<typeof ShowFollowDataSchema>;

/* -------------------------------------------------------------------------- */
/*                              Show follow error                             */
/* -------------------------------------------------------------------------- */

export type ShowFollowError = NotFoundError;
