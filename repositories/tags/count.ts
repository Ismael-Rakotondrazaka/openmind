import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const count = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.TagWhereInput;
  orderBy?: Prisma.TagOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<number> => {
  return prisma.tag.count({
    where,
    orderBy,
    skip,
    take,
  });
};
