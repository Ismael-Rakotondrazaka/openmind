import { z } from "zod";
import { ViewFullSchema } from "~/schemas/globalSchemas/views/viewFull";

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
  view: ViewFullSchema,
});

export type UpdateViewData = z.infer<typeof UpdateViewDataSchema>;

/* -------------------------------------------------------------------------- */
/*                              Update view error                             */
/* -------------------------------------------------------------------------- */

export type UpdateViewError =
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError;
