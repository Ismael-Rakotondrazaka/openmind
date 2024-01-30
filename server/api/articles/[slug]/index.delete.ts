import type { SafeParseReturnType } from "zod";
import type { Article, User } from "@prisma/client";
import {
  createNotFoundError,
  createUnauthorizedError,
  createForbiddenError,
  type DestroyArticleData,
  type DestroyArticleError,
  type DestroyArticleParam,
  DestroyArticleParamSchema,
  DestroyArticleDataSchema,
} from "~/utils";
import { articleRepository } from "~/repositories";

export default defineEventHandler(
  async (event): Promise<DestroyArticleData | DestroyArticleError> => {
    const destroyArticleParamSPR: SafeParseReturnType<
      DestroyArticleParam,
      DestroyArticleParam
    > = await safeParseRequestParamAs(event, DestroyArticleParamSchema);

    if (!destroyArticleParamSPR.success) {
      return createNotFoundError(event);
    }

    const article: Article | null = await articleRepository.findOne({
      where: {
        slug: destroyArticleParamSPR.data.slug,
      },
    });

    if (article === null || article.deletedAt !== null) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    if (authUser.id !== article.userId && authUser.role === "user") {
      return createForbiddenError(event);
    }

    const now = new Date();

    const deletedArticle: DestroyArticleData["article"] =
      await articleRepository.updateFullOne({
        where: {
          id: article.id,
        },
        data: {
          deletedAt: now,
          updatedAt: now,
        },
        authUser,
      });

    return DestroyArticleDataSchema.parse({
      article: deletedArticle,
    });
  },
);
