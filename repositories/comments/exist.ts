import { type Prisma } from "@prisma/client";
import { count } from "~/repositories/comments/count";

export const exist = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.CommentWhereInput;
  orderBy?: Prisma.CommentOrderByWithRelationInput;
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
