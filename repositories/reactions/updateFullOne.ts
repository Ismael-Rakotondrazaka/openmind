import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { ReactionFullSchema, type ReactionFull } from "~/utils";

export const updateFullOne = ({
  data,
  where,
}: {
  data:
    | (Prisma.Without<
        Prisma.ReactionUpdateInput,
        Prisma.ReactionUncheckedUpdateInput
      > &
        Prisma.ReactionUncheckedUpdateInput)
    | (Prisma.Without<
        Prisma.ReactionUncheckedUpdateInput,
        Prisma.ReactionUpdateInput
      > &
        Prisma.ReactionUpdateInput);
  where: Prisma.ReactionUpdateArgs["where"];
}): Promise<ReactionFull> => {
  return prisma.reaction
    .update({
      where,
      data,
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
    })
    .then((reaction) => {
      const parsedReaction: ReactionFull = ReactionFullSchema.parse(reaction);

      return parsedReaction;
    });
};
