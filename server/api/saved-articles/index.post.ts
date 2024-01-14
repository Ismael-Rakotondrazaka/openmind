import type { Article, SavedArticle, User } from "@prisma/client";
import {
  type StoreSavedArticleData,
  type StoreSavedArticleError,
  createBadRequestError,
  createUnauthorizedError,
  getRequestErrorMessage,
  StoreSavedArticleBodySchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<StoreSavedArticleData | StoreSavedArticleError> => {
    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    const storeSavedArticleBodySPR = await safeParseRequestBodyAs(
      event,
      StoreSavedArticleBodySchema,
    );

    if (!storeSavedArticleBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(storeSavedArticleBodySPR),
      });
    }

    const article: Article | null =
      await event.context.prisma.article.findFirst({
        where: {
          id: storeSavedArticleBodySPR.data.articleId,
          isVisible: true,
          deletedAt: null,
        },
      });

    if (article === null) {
      return createBadRequestError(event, {
        errorMessage: {
          articleId: "The article does not exists.",
        },
      });
    }

    const isAlreadySaved: boolean = await event.context.prisma.savedArticle
      .findFirst({
        where: {
          userId: authUser.id,
          articleId: storeSavedArticleBodySPR.data.articleId,
        },
      })
      .then((val: SavedArticle | null) => val !== null);

    if (isAlreadySaved) {
      return createBadRequestError(event, {
        errorMessage: {
          articleId: "The article is already saved.",
        },
      });
    }

    const savedArticle: StoreSavedArticleData["savedArticle"] =
      await event.context.prisma.savedArticle.create({
        data: {
          articleId: storeSavedArticleBodySPR.data.articleId,
          userId: authUser.id,
        },
        include: {
          article: {
            include: {
              tags: true,
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
          },
        },
      });

    return {
      savedArticle,
    };
  },
);
