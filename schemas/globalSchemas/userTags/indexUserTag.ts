import type { Tag } from "@prisma/client";
import type { UnauthorizedError } from "~/utils/errors";

/* -------------------------------------------------------------------------- */
/*                             Index userTag data                             */
/* -------------------------------------------------------------------------- */

export type IndexUserTagData = {
  tags: Tag[];
};

/* -------------------------------------------------------------------------- */
/*                             Index userTag error                            */
/* -------------------------------------------------------------------------- */

export type IndexUserTagError = UnauthorizedError;
