import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { CommentFullSchema, type CommentFull } from "~/utils";

export const findFullMany = ({
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
}): Promise<CommentFull[]> => {
  return prisma.comment
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
      take,
      skip,
    })
    .then((comments): CommentFull[] => {
      if (authUser !== null) {
        return comments.map((comment): CommentFull => {
          const auth: IndexCommentData["comments"][0]["auth"] = {
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
        });
      } else {
        return comments.map((article): CommentFull => {
          const parsedComment: CommentFull = CommentFullSchema.parse({
            ...article,
            auth: null,
          });

          return parsedComment;
        });
      }
    });
};
