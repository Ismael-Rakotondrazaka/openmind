import type { User } from "@prisma/client";
import {
  type StoreReactionData,
  type StoreReactionError,
  createBadRequestError,
  createUnauthorizedError,
  getRequestErrorMessage,
  StoreReactionBodySchema,
  ReactionSchema,
} from "~/utils";
import { getAuthUser } from "~/server/utils";

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

    const isReactionAlreadyExists: boolean = await event.context.prisma.reaction
      .findFirst({
        where: {
          userId: authUser.id,
          articleId: storeReactionBodySPR.data.articleId,
          commentId: storeReactionBodySPR.data.commentId,
        },
      })
      .then((value) => value !== null);

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
      const isArticleExists: boolean = await event.context.prisma.article
        .count({
          where: {
            id: storeReactionBodySPR.data.articleId,
            deletedAt: null,
            isVisible: true,
          },
        })
        .then((count) => count > 0);

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
      const isCommentExists: boolean = await event.context.prisma.comment
        .count({
          where: {
            id: storeReactionBodySPR.data.commentId,
            deletedAt: null,
          },
        })
        .then((count) => count > 0);

      if (!isCommentExists) {
        return createBadRequestError(event, {
          message: "The comment does not exists.",
          errorMessage: {
            commentId: "The comment does not exists.",
          },
        });
      }
    }

    const createdReactionRaw = await event.context.prisma.reaction.create({
      data: {
        type: storeReactionBodySPR.data.type,
        userId: authUser.id,
        articleId: storeReactionBodySPR.data.articleId,
        commentId: storeReactionBodySPR.data.commentId,
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
      },
    });

    const createdReactionFormatted: StoreReactionData["reaction"] = {
      ...ReactionSchema.parse(createdReactionRaw),
      user: createdReactionRaw.user,
    };

    return {
      reaction: createdReactionFormatted,
    };
  },
);
