import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { FollowFullSchema, type FollowFull } from "~/utils";

export const updateFullOne = ({
  data,
  where,
}: {
  data:
    | (Prisma.Without<
        Prisma.FollowUpdateInput,
        Prisma.FollowUncheckedUpdateInput
      > &
        Prisma.FollowUncheckedUpdateInput)
    | (Prisma.Without<
        Prisma.FollowUncheckedUpdateInput,
        Prisma.FollowUpdateInput
      > &
        Prisma.FollowUpdateInput);
  where: Prisma.FollowUpdateArgs["where"];
}): Promise<FollowFull> => {
  return prisma.follow
    .update({
      where,
      data,
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
    })
    .then((follow) => {
      const parsedFollow: FollowFull = FollowFullSchema.parse(follow);

      return parsedFollow;
    });
};
