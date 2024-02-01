import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const count = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.CommentWhereInput;
  orderBy?: Prisma.CommentOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<number> => {
  return prisma.comment.count({
    where,
    orderBy,
    skip,
    take,
  });
};
