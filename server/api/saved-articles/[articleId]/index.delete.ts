import type { Article, SavedArticle, User } from "@prisma/client";
import type { SafeParseReturnType } from "zod";
import { articleRepository, savedArticleRepository } from "~/repositories";
import {
  DestroySavedArticleDataSchema,
  DestroySavedArticleParamSchema,
  createForbiddenError,
  createNotFoundError,
  createUnauthorizedError,
  type DestroySavedArticleData,
  type DestroySavedArticleError,
  type DestroySavedArticleParam,
} from "~/utils";

export default defineEventHandler(
  async (
    event,
  ): Promise<DestroySavedArticleData | DestroySavedArticleError> => {
    const destroySavedArticleParamSPR: SafeParseReturnType<
      DestroySavedArticleParam,
      DestroySavedArticleParam
    > = await safeParseRequestParamAs(event, DestroySavedArticleParamSchema);

    if (!destroySavedArticleParamSPR.success) {
      return createNotFoundError(event);
    }

    const article: Article | null = await articleRepository.findOne({
      where: {
        id: destroySavedArticleParamSPR.data.articleId,
      },
    });

    if (article === null || article.deletedAt !== null) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    const savedArticle: SavedArticle | null =
      await savedArticleRepository.findOne({
        where: {
          articleId: article.id,
          userId: authUser.id,
        },
      });

    if (savedArticle === null) {
      return createForbiddenError(event);
    }

    await savedArticleRepository.deleteOne({
      where: {
        userId_articleId: {
          userId: authUser.id,
          articleId: article.id,
        },
      },
    });

    const articleSavedDeleted: DestroySavedArticleData["article"] | null =
      await articleRepository.findFullOne({
        where: {
          id: article.id,
        },
        authUser,
      });

    if (articleSavedDeleted === null) {
      return createNotFoundError(event);
    }

    return DestroySavedArticleDataSchema.parse({
      article: articleSavedDeleted,
    });
  },
);
