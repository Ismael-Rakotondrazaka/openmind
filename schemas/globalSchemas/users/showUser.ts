import { z } from "zod";
import { UserFullSchema } from "~/schemas/globalSchemas/users/userFull";

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
  user: UserFullSchema,
});

export type ShowUserData = z.infer<typeof ShowUserDataSchema>;

/* -------------------------------------------------------------------------- */
/*                               Show user error                              */
/* -------------------------------------------------------------------------- */
export type ShowUserError = NotFoundError;
