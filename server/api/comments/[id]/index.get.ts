import type { User } from "@prisma/client";
import { commentRepository } from "~/repositories";
import {
  type ShowCommentData,
  type ShowCommentError,
  ShowCommentParamSchema,
  createNotFoundError,
  ShowCommentDataSchema,
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
      await commentRepository.findFullOne({
        where: {
          id: showCommentParamSPR.data.id,
        },
        authUser,
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

    return ShowCommentDataSchema.parse({
      comment,
    });
  },
);
