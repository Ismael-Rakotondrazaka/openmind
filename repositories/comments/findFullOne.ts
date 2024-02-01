import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { CommentFullSchema, type CommentFull } from "~/utils";

export const findFullOne = async ({
  authUser,
  where,
  orderBy,
  skip,
  take,
}: {
  authUser: User | null;
  where?: Prisma.CommentWhereInput;
  orderBy?: Prisma.CommentOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<CommentFull | null> => {
  const comment = await prisma.comment.findFirst({
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
      /* eslint-disable indent */
      reactions:
        authUser === null
          ? undefined
          : {
              where: {
                userId: authUser.id,
              },
            },
      /* eslint-enable indent */
      _count: {
        select: {
          replies: {
            where: {
              deletedAt: null,
            },
          },
          reactions: true,
        },
      },
    },
    orderBy,
    skip,
    take,
  });

  if (comment !== null) {
    if (authUser !== null) {
      const auth: ShowCommentData["comment"]["auth"] = {
        reaction: null,
      };

      if (comment.reactions.length > 0) {
        auth.reaction = comment.reactions[0] as Reaction;
      }

      const parsedComment: CommentFull = CommentFullSchema.parse({
        ...comment,
        auth,
      });

      return parsedComment;
    } else {
      const parsedComment: CommentFull = CommentFullSchema.parse({
        ...comment,
        auth: null,
      });

      return parsedComment;
    }
  } else {
    return null;
  }
};
