import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { FollowFullSchema, type FollowFull } from "~/utils";

export const findFullOne = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.FollowWhereInput;
  orderBy?: Prisma.FollowOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<FollowFull | null> => {
  const follow = await prisma.follow.findFirst({
    where,
    include: {
      follower: {
        select: {
          id: true,
          username: true,
          name: true,
          firstName: true,
          profileUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      },
      following: {
        select: {
          id: true,
          username: true,
          name: true,
          firstName: true,
          profileUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      },
    },
    orderBy,
    skip,
    take,
  });

  if (follow !== null) {
    const parsedFollow: FollowFull = FollowFullSchema.parse(follow);

    return parsedFollow;
  } else {
    return null;
  }
};
