import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { ReactionFullSchema, type ReactionFull } from "~/utils";

export const findFullMany = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.ReactionWhereInput;
  orderBy?: Prisma.ReactionOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<ReactionFull[]> => {
  return prisma.reaction
    .findMany({
      where,
      include: {
        user: {
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
        article: {
          select: {
            isVisible: true,
            deletedAt: true,
            userId: true,
          },
        },
        comment: {
          select: {
            deletedAt: true,
            userId: true,
          },
        },
      },
      orderBy,
      take,
      skip,
    })
    .then((reactions): ReactionFull[] => {
      return reactions.map((reaction): ReactionFull => {
        const parsedReaction: ReactionFull = ReactionFullSchema.parse(reaction);

        return parsedReaction;
      });
    });
};
