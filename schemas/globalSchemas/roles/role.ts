import { z } from "zod";

export const RoleSchema = z.enum(["admin", "modo", "user"]);

export type Role = z.infer<typeof RoleSchema>;
