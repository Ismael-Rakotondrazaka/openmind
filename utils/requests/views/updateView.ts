import { z } from "zod";
import { ViewSchema, UserSchema } from "~/utils/schemas";

/* -------------------------------------------------------------------------- */
/*                              Update view param                             */
/* -------------------------------------------------------------------------- */

export const UpdateViewParamSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export type UpdateViewParam = z.infer<typeof UpdateViewParamSchema>;

/* -------------------------------------------------------------------------- */
/*                              Update view data                              */
/* -------------------------------------------------------------------------- */

export const UpdateViewDataSchema = z.object({
  view: ViewSchema.and(
    z.object({
      user: UserSchema,
    }),
  ),
});

export type UpdateViewData = z.infer<typeof UpdateViewDataSchema>;

/* -------------------------------------------------------------------------- */
/*                              Update view error                             */
/* -------------------------------------------------------------------------- */

export type UpdateViewError =
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError;