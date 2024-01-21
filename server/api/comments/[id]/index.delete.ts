import type { Comment, User } from "@prisma/client";
import {
  type DestroyCommentData,
  type DestroyCommentError,
  DestroyCommentParamSchema,
  createNotFoundError,
  createUnauthorizedError,
  createForbiddenError,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<DestroyCommentData | DestroyCommentError> => {
    const destroyCommentParamSPR = await safeParseRequestParamAs(
      event,
      DestroyCommentParamSchema,
    );

    if (!destroyCommentParamSPR.success) {
      return createNotFoundError(event);
    }

    const comment: Comment | null =
      await event.context.prisma.comment.findFirst({
        where: {
          id: destroyCommentParamSPR.data.id,
        },
      });

    if (comment === null || comment.deletedAt !== null) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    if (authUser.id !== comment.userId && authUser.role === "user") {
      return createForbiddenError(event);
    }

    const now = new Date();

    const deletedComment: DestroyCommentData["comment"] =
      await event.context.prisma.comment.update({
        where: {
          id: comment.id,
        },
        data: {
          deletedAt: now,
          updatedAt: now,
        },
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
          _count: {
            select: {
              replies: {
                where: {
                  deletedAt: null,
                },
              },
            },
          },
        },
      });

    return {
      comment: deletedComment,
    };
  },
);
