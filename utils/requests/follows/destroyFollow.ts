import { z } from "zod";
import { FollowSchema, UserSchema } from "~/utils/schemas";

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
  follow: FollowSchema.and(
    z.object({
      follower: UserSchema,
    }),
  ).and(
    z.object({
      following: UserSchema,
    }),
  ),
});

export type DestroyFollowData = z.infer<typeof DestroyFollowDataSchema>;

/* -------------------------------------------------------------------------- */
/*                            Destroy follow error                            */
/* -------------------------------------------------------------------------- */

export type DestroyFollowError =
  | NotFoundError
  | UnauthorizedError
  | ForbiddenError;
