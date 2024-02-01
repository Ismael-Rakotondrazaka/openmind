import { type Prisma } from "@prisma/client";
import { count } from "~/repositories/reactions/count";

export const exist = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.ReactionWhereInput;
  orderBy?: Prisma.ReactionOrderByWithRelationInput;
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