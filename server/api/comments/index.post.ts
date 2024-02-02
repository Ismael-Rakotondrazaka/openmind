import type { Article, User, Comment } from "@prisma/client";
import { articleRepository, commentRepository } from "~/repositories";
import {
  type StoreCommentData,
  type StoreCommentError,
  createBadRequestError,
  createUnauthorizedError,
  getRequestErrorMessage,
  StoreCommentDataSchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<StoreCommentData | StoreCommentError> => {
    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    const storeCommentBodySPR = await safeParseRequestBodyAs(
      event,
      StoreCommentBodySchema,
    );

    if (!storeCommentBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(storeCommentBodySPR),
      });
    }

    const article: Article | null = await articleRepository.findOne({
      where: {
        id: storeCommentBodySPR.data.articleId,
        deletedAt: null,
        isVisible: true,
      },
    });

    if (article === null) {
      return createBadRequestError(event, {
        errorMessage: {
          articleId: "The article does not exist.",
        },
      });
    }

    if (
      storeCommentBodySPR.data.parentId !== null &&
      storeCommentBodySPR.data.parentId !== undefined
    ) {
      const comment: Comment | null = await commentRepository.findOne({
        where: {
          id: storeCommentBodySPR.data.parentId,
          deletedAt: null,
        },
      });

      if (comment === null) {
        return createBadRequestError(event, {
          errorMessage: {
            articleId: "The comment does not exist.",
          },
        });
      }

      if (comment.parentId !== null) {
        return createBadRequestError(event, {
          errorMessage: {
            articleId: "Cannot reply to the comment.",
          },
        });
      }
    }

    const commentId: string = createCommentId();
    const now: Date = new Date();

    const { content, filesToSave } = formatCommentContent(
      storeCommentBodySPR.data.content,
      commentId,
    );

    Promise.allSettled(filesToSave.map(saveUploadedFile));

    const comment: StoreCommentData["comment"] =
      await commentRepository.createFullOne({
        data: {
          id: commentId,
          content,
          createdAt: now,
          updatedAt: now,
          userId: authUser.id,
          articleId: article.id,
          parentId: storeCommentBodySPR.data.parentId,
        },
        authUser,
      });

    return StoreCommentDataSchema.parse({
      comment,
    });
  },
);
