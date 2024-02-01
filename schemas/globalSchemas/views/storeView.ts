import { z } from "zod";
import { ViewFullSchema } from "~/schemas/globalSchemas/views/viewFull";

/* -------------------------------------------------------------------------- */
/*                               Store view body                              */
/* -------------------------------------------------------------------------- */

export const StoreViewBodySchema = z.object({
  articleId: z.string().trim(),
});

export type StoreViewBody = z.infer<typeof StoreViewBodySchema>;

export type StoreViewBodyPEM = RequestErrorMessage<StoreViewBody>;

/* -------------------------------------------------------------------------- */
/*                               Store view data                              */
/* -------------------------------------------------------------------------- */

export const StoreViewDataSchema = z.object({
  view: ViewFullSchema,
});

export type StoreViewData = z.infer<typeof StoreViewDataSchema>;

/* -------------------------------------------------------------------------- */
/*                              Store view error                              */
/* -------------------------------------------------------------------------- */

export type StoreViewError =
  | BadRequestError<StoreViewBodyPEM>
  | UnauthorizedError;
