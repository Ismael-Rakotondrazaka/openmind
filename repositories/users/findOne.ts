import { type Prisma, type User } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const findOne = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<User | null> => {
  const user: User | null = await prisma.user.findFirst({
    where,
    orderBy,
    skip,
    take,
  });
  return user;
};
