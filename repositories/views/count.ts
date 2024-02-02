import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const count = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.ViewWhereInput;
  orderBy?: Prisma.ViewOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<number> => {
  return prisma.view.count({
    where,
    orderBy,
    skip,
    take,
  });
};
