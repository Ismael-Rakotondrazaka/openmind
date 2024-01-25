import { z } from "zod";
import { FollowSchema, UserSchema } from "~/utils/schemas";

/* -------------------------------------------------------------------------- */
/*                             Show article param                             */
/* -------------------------------------------------------------------------- */

export const ShowFollowParamSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export type ShowFollowParam = z.infer<typeof ShowFollowParamSchema>;

/* -------------------------------------------------------------------------- */
/*                              Show article data                             */
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
/*                             Show article error                             */
/* -------------------------------------------------------------------------- */

export type ShowFollowError = NotFoundError;
