import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { FollowFullSchema, type FollowFull } from "~/utils";

export const findFullMany = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.FollowWhereInput;
  orderBy?: Prisma.FollowOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<FollowFull[]> => {
  return prisma.follow
    .findMany({
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
      take,
      skip,
    })
    .then((follows): FollowFull[] => {
      return follows.map((follow): FollowFull => {
        const parsedFollow: FollowFull = FollowFullSchema.parse(follow);

        return parsedFollow;
      });
    });
};
