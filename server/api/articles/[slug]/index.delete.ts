import type { SafeParseReturnType } from "zod";
import type { Article, User } from "@prisma/client";
import {
  type DestroyArticleData,
  type DestroyArticleError,
  type DestroyArticleParam,
  DestroyArticleParamSchema,
  createNotFoundError,
  createUnauthorizedError,
  createForbiddenError,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<DestroyArticleData | DestroyArticleError> => {
    const destroyArticleParamSPR: SafeParseReturnType<
      DestroyArticleParam,
      DestroyArticleParam
    > = await safeParseRequestParamAs(event, DestroyArticleParamSchema);

    if (!destroyArticleParamSPR.success) {
      return createNotFoundError(event);
    }

    const article: Article | null =
      await event.context.prisma.article.findFirst({
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
      await event.context.prisma.article.update({
        where: {
          id: article.id,
        },
        data: {
          deletedAt: now,
          updatedAt: now,
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
          tags: true,
        },
      });

    return {
      article: deletedArticle,
    };
  },
);
