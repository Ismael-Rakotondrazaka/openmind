import { z } from "zod";
import { passwordConfig } from "~/utils/configs";

export const StoreLoginBodySchema = z
  .object({
    usernameOrEmail: z.string().min(1),
    password: z.string().min(passwordConfig.PASSWORD_MIN_LENGTH),
  })
  .required();

export type StoreLoginBody = z.infer<typeof StoreLoginBodySchema>;
