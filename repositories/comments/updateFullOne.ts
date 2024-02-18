import { type Prisma, type User } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { CommentFullSchema, type CommentFull } from "~/utils";

export const updateFullOne = ({
  authUser,
  data,
  where,
}: {
  authUser: User | null;
  data:
    | (Prisma.Without<
        Prisma.CommentUpdateInput,
        Prisma.CommentUncheckedUpdateInput
      > &
        Prisma.CommentUncheckedUpdateInput)
    | (Prisma.Without<
        Prisma.CommentUncheckedUpdateInput,
        Prisma.CommentUpdateInput
      > &
        Prisma.CommentUpdateInput);
  where: Prisma.CommentUpdateArgs["where"];
}): Promise<CommentFull> => {
  return prisma.comment
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
    })
    .then((comment) => {
      if (authUser !== null) {
        const _auth: ShowCommentData["comment"]["_auth"] = {
          reaction: null,
        };

        if (comment.reactions.length > 0) {
          _auth.reaction = comment.reactions[0] as Reaction;
        }

        const parsedComment: CommentFull = CommentFullSchema.parse({
          ...comment,
          _auth,
        });

        return parsedComment;
      } else {
        const parsedComment: CommentFull = CommentFullSchema.parse({
          ...comment,
          _auth: null,
        });

        return parsedComment;
      }
    });
};
