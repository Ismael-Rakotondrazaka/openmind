import { z } from "zod";
import { FollowSchema } from "~/schemas/globalSchemas/follows/follow";
import { UserSchema } from "~/schemas/globalSchemas/users";

/* -------------------------------------------------------------------------- */
/*                             Show article param                             */
/* -------------------------------------------------------------------------- */

export const ShowFollowParamSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export type ShowFollowParam = z.infer<typeof ShowFollowParamSchema>;

/* -------------------------------------------------------------------------- */
/*                              Show follow data                              */
/* -------------------------------------------------------------------------- */

export const ShowFollowDataSchema = z.object({
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

export type ShowFollowData = z.infer<typeof ShowFollowDataSchema>;

/* -------------------------------------------------------------------------- */
/*                              Show follow error                             */
/* -------------------------------------------------------------------------- */

export type ShowFollowError = NotFoundError;
