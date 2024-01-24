import { z } from "zod";
import { ViewSchema, UserSchema } from "~/utils/schemas";

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
  view: ViewSchema.and(
    z.object({
      user: UserSchema,
    }),
  ),
});

export type StoreViewData = z.infer<typeof StoreViewDataSchema>;

/* -------------------------------------------------------------------------- */
/*                              Store view error                              */
/* -------------------------------------------------------------------------- */

export type StoreViewError =
  | BadRequestError<StoreViewBodyPEM>
  | UnauthorizedError;
