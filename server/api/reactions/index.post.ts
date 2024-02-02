import type { User } from "@prisma/client";
import {
  type StoreReactionData,
  type StoreReactionError,
  createBadRequestError,
  createUnauthorizedError,
  getRequestErrorMessage,
  StoreReactionBodySchema,
  StoreReactionDataSchema,
} from "~/utils";
import { getAuthUser } from "~/server/utils";
import {
  articleRepository,
  commentRepository,
  reactionRepository,
} from "~/repositories";

export default defineEventHandler(
  async (event): Promise<StoreReactionData | StoreReactionError> => {
    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    const storeReactionBodySPR = await safeParseRequestBodyAs(
      event,
      StoreReactionBodySchema,
    );

    if (!storeReactionBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(storeReactionBodySPR),
      });
    }

    if (
      (typeof storeReactionBodySPR.data.articleId !== "string" &&
        typeof storeReactionBodySPR.data.commentId !== "string") ||
      (typeof storeReactionBodySPR.data.articleId === "string" &&
        typeof storeReactionBodySPR.data.commentId === "string")
    ) {
      return createBadRequestError(event, {
        message: "Cannot react to the article or comment.",
        errorMessage: {
          articleId: "Cannot react to the article.",
          commentId: "Cannot react to the comment.",
        },
      });
    }

    const isReactionAlreadyExists: boolean = await reactionRepository.exist({
      where: {
        userId: authUser.id,
        articleId: storeReactionBodySPR.data.articleId,
        commentId: storeReactionBodySPR.data.commentId,
      },
    });

    if (isReactionAlreadyExists) {
      return createBadRequestError(event, {
        message: "Already react to the comment or article.",
        errorMessage: {
          commentId:
            typeof storeReactionBodySPR.data.commentId === "string"
              ? "Already react to the comment."
              : undefined,
          articleId:
            typeof storeReactionBodySPR.data.articleId === "string"
              ? "Already react to the article."
              : undefined,
        },
      });
    }

    if (typeof storeReactionBodySPR.data.articleId === "string") {
      const isArticleExists: boolean = await articleRepository.exist({
        where: {
          id: storeReactionBodySPR.data.articleId,
          deletedAt: null,
          isVisible: true,
        },
      });

      if (!isArticleExists) {
        return createBadRequestError(event, {
          message: "The article does not exists.",
          errorMessage: {
            articleId: "The article does not exists.",
          },
        });
      }
    }

    if (typeof storeReactionBodySPR.data.commentId === "string") {
      const isCommentExists: boolean = await commentRepository.exist({
        where: {
          id: storeReactionBodySPR.data.commentId,
          deletedAt: null,
        },
      });

      if (!isCommentExists) {
        return createBadRequestError(event, {
          message: "The comment does not exists.",
          errorMessage: {
            commentId: "The comment does not exists.",
          },
        });
      }
    }

    const createdReaction: StoreReactionData["reaction"] =
      await reactionRepository.createFullOne({
        data: {
          type: storeReactionBodySPR.data.type,
          userId: authUser.id,
          articleId: storeReactionBodySPR.data.articleId,
          commentId: storeReactionBodySPR.data.commentId,
        },
      });

    return StoreReactionDataSchema.parse({
      reaction: createdReaction,
    });
  },
);
