import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const count = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.FollowWhereInput;
  orderBy?: Prisma.FollowOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<number> => {
  return prisma.follow.count({
    where,
    orderBy,
    skip,
    take,
  });
};
