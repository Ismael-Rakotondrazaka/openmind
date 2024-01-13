import type { User } from "@prisma/client";
import { z } from "zod";
import { userConfig, passwordConfig } from "~/utils/configs";

export const StoreRegisterBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(userConfig.NAME_MIN_LENGTH)
    .max(userConfig.NAME_MAX_LENGTH),
  firstName: z
    .string()
    .trim()
    .min(userConfig.FIRST_NAME_MIN_LENGTH)
    .max(userConfig.FIRST_NAME_MAX_LENGTH),
  username: z
    .string()
    .trim()
    .min(userConfig.USERNAME_MIN_LENGTH)
    .max(userConfig.USERNAME_MAX_LENGTH),
  email: z.string().trim().email().max(userConfig.EMAIL_MAX_LENGTH),
  password: z.string().min(passwordConfig.PASSWORD_MIN_LENGTH),
});

export type StoreRegisterBody = z.infer<typeof StoreRegisterBodySchema>;

export type StoreRegisterBodyPEM = RequestErrorMessage<StoreRegisterBody>;

export type StoreRegisterData = {
  user: Omit<User, "password" | "email" | "emailVerifiedAt">;
};

export type StoreRegisterError = BadRequestError<StoreRegisterBodyPEM>;
