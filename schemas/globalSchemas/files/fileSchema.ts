import { z } from "zod";

export const FileSchema = z.custom<File>(
  (value: unknown) => value instanceof File,
);
