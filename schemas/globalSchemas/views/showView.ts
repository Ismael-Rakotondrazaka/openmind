import { z } from "zod";
import { ViewFullSchema } from "~/schemas/globalSchemas/views/viewFull";

/* -------------------------------------------------------------------------- */
/*                               Show view param                              */
/* -------------------------------------------------------------------------- */

export const ShowViewParamSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export type ShowViewParam = z.infer<typeof ShowViewParamSchema>;

/* -------------------------------------------------------------------------- */
/*                               Show view data                               */
/* -------------------------------------------------------------------------- */

export const ShowViewDataSchema = z.object({
  view: ViewFullSchema,
});

export type ShowViewData = z.infer<typeof ShowViewDataSchema>;

/* -------------------------------------------------------------------------- */
/*                               Show view error                              */
/* -------------------------------------------------------------------------- */

export type ShowViewError = NotFoundError;
