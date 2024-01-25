import { z } from "zod";
import { FollowSchema, UserSchema } from "~/utils/schemas";

/* -------------------------------------------------------------------------- */
/*                              Store follow body                             */
/* -------------------------------------------------------------------------- */

export const StoreFollowBodySchema = z.object({
  userId: z.coerce.number().positive().int(),
});

export type StoreFollowBody = z.infer<typeof StoreFollowBodySchema>;

export type StoreFollowBodyPEM = RequestErrorMessage<StoreFollowBody>;

/* -------------------------------------------------------------------------- */
/*                              Store follow data                             */
/* -------------------------------------------------------------------------- */

export const StoreFollowDataSchema = z.object({
  follow: FollowSchema.and(
    z.object({
      following: UserSchema,
    }),
  ).and(
    z.object({
      follower: UserSchema,
    }),
  ),
});

export type StoreFollowData = z.infer<typeof StoreFollowDataSchema>;

/* -------------------------------------------------------------------------- */
/*                             Store follow error                             */
/* -------------------------------------------------------------------------- */

export type StoreFollowError =
  | BadRequestError<StoreFollowBodyPEM>
  | UnauthorizedError;
