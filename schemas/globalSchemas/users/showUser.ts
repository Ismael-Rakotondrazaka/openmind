import { z } from "zod";
import { TagSchema } from "~/schemas/globalSchemas/tags/tag";
import { UserSchema } from "~/schemas/globalSchemas/users/user";
import { UserCountSchema } from "~/schemas/globalSchemas/users/userCount";
import { UserAuthSchema } from "~/schemas/globalSchemas/users/userAuth";

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
