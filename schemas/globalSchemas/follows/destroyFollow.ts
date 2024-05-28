import { z } from "zod";
import { FollowFullSchema } from "~/schemas/globalSchemas/follows/follow";

/* -------------------------------------------------------------------------- */
/*                            Destroy follow param                            */
/* -------------------------------------------------------------------------- */

export const DestroyFollowParamSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export type DestroyFollowParam = z.infer<typeof DestroyFollowParamSchema>;

/* -------------------------------------------------------------------------- */
/*                             Destroy follow data                            */
/* -------------------------------------------------------------------------- */

export const DestroyFollowDataSchema = z.object({
  follow: FollowFullSchema,
});

export type DestroyFollowData = z.infer<typeof DestroyFollowDataSchema>;

/* -------------------------------------------------------------------------- */
/*                            Destroy follow error                            */
/* -------------------------------------------------------------------------- */

export type DestroyFollowError =
  | NotFoundError
  | UnauthorizedError
  | ForbiddenError;
