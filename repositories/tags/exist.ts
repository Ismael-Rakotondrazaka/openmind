import { type Prisma } from "@prisma/client";
import { count } from "~/repositories/tags/count";

export const exist = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.TagWhereInput;
  orderBy?: Prisma.TagOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<boolean> => {
  return count({
    where,
    orderBy,
    skip,
    take,
  }).then((count: number) => count > 0);
};
