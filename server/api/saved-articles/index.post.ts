import type { Article, User } from "@prisma/client";
import { articleRepository, savedArticleRepository } from "~/repositories";
import {
  type StoreSavedArticleData,
  type StoreSavedArticleError,
  createBadRequestError,
  createUnauthorizedError,
  getRequestErrorMessage,
  StoreSavedArticleBodySchema,
  StoreSavedArticleDataSchema,
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

    const article: Article | null = await articleRepository.findOne({
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

    const isAlreadySaved: boolean = await savedArticleRepository.exist({
      where: {
        userId: authUser.id,
        articleId: storeSavedArticleBodySPR.data.articleId,
      },
    });

    if (isAlreadySaved) {
      return createBadRequestError(event, {
        errorMessage: {
          articleId: "The article is already saved.",
        },
      });
    }

    const savedArticle: StoreSavedArticleData["savedArticle"] =
      await savedArticleRepository.createFullOne({
        data: {
          articleId: storeSavedArticleBodySPR.data.articleId,
          userId: authUser.id,
        },
        authUser,
      });

    return StoreSavedArticleDataSchema.parse({
      savedArticle,
    });
  },
);
