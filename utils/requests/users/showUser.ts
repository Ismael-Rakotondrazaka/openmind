import { z } from "zod";
import {
  TagSchema,
  UserSchema,
  UserCountSchema,
  UserAuthSchema,
} from "~/utils/schemas";

/* -------------------------------------------------------------------------- */
/*                               Show user param                              */
/* -------------------------------------------------------------------------- */

export const ShowUserParamSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export type ShowUserParam = z.infer<typeof ShowUserParamSchema>;

/* -------------------------------------------------------------------------- */
/*                               Show user data                               */
/* -------------------------------------------------------------------------- */
export const ShowUserDataSchema = z.object({
  user: UserSchema.and(
    z.object({
      tags: z.array(TagSchema),
    }),
  )
    .and(UserCountSchema)
    .and(UserAuthSchema),
});

export type ShowUserData = z.infer<typeof ShowUserDataSchema>;

/* -------------------------------------------------------------------------- */
/*                               Show user error                              */
/* -------------------------------------------------------------------------- */
export type ShowUserError = NotFoundError;
