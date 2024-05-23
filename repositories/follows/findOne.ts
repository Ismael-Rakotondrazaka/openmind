import { type Prisma, type Follow } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { FollowSchema } from "~/prisma/generated/zod";

export const findOne = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.FollowWhereInput;
  orderBy?: Prisma.FollowOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<Follow | null> => {
  const rawFollow = await prisma.follow.findFirst({
    where,
    orderBy,
    skip,
    take,
  });

  let parsedFollow: Follow | null = null;

  if (rawFollow !== null) {
    parsedFollow = FollowSchema.parse(rawFollow);
  }

  return parsedFollow;
};
