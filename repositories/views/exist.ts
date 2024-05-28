import { type Prisma } from "@prisma/client";
import { count } from "~/repositories/views/count";

export const exist = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.ViewWhereInput;
  orderBy?: Prisma.ViewOrderByWithRelationInput;
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
