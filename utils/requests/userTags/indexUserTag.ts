import type { Tag } from "@prisma/client";
import type { UnauthorizedError } from "~/utils/errors";

export type IndexUserTagData = {
  tags: Tag[];
};

export type IndexUserTagError = UnauthorizedError;
