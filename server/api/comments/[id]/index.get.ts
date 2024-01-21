import type { User } from "@prisma/client";
import {
  type ShowCommentData,
  type ShowCommentError,
  ShowCommentParamSchema,
  createNotFoundError,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<ShowCommentData | ShowCommentError> => {
    const showCommentParamSPR = await safeParseRequestParamAs(
      event,
      ShowCommentParamSchema,
    );

    if (!showCommentParamSPR.success) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);

    const comment: ShowCommentData["comment"] | null =
      await event.context.prisma.comment.findFirst({
        where: {
          id: showCommentParamSPR.data.id,
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

    if (
      comment === null ||
      (authUser === null && comment.deletedAt !== null) ||
      (authUser !== null &&
        comment.userId !== authUser.id &&
        authUser.role === "user")
    ) {
      return createNotFoundError(event);
    }

    return {
      comment,
    };
  },
);
