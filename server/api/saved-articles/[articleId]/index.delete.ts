import type { SafeParseReturnType } from "zod";
import type { Article, SavedArticle, User } from "@prisma/client";
import {
  type DestroySavedArticleData,
  type DestroySavedArticleError,
  type DestroySavedArticleParam,
  DestroySavedArticleParamSchema,
  createNotFoundError,
  createUnauthorizedError,
  createForbiddenError,
  DestroySavedArticleDataSchema,
} from "~/utils";
import { articleRepository } from "~/repositories";

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
      await event.context.prisma.savedArticle.findFirst({
        where: {
          articleId: article.id,
          userId: authUser.id,
        },
      });

    if (savedArticle === null) {
      return createForbiddenError(event);
    }

    await event.context.prisma.savedArticle.delete({
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
