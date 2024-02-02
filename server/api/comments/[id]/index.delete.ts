import type { Comment, User } from "@prisma/client";
import { commentRepository } from "~/repositories";
import {
  type DestroyCommentData,
  type DestroyCommentError,
  DestroyCommentParamSchema,
  createNotFoundError,
  createUnauthorizedError,
  createForbiddenError,
  DestroyCommentDataSchema,
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

    const comment: Comment | null = await commentRepository.findOne({
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
      await commentRepository.updateFullOne({
        where: {
          id: comment.id,
        },
        data: {
          deletedAt: now,
          updatedAt: now,
        },
        authUser,
      });

    return DestroyCommentDataSchema.parse({
      comment: deletedComment,
    });
  },
);
