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
  type Reaction,
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

    const article: Article | null =
      await event.context.prisma.article.findUnique({
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
      await event.context.prisma.article
        .findFirst({
          where: {
            id: article.id,
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
            savedArticles: {
              where: {
                userId: authUser.id,
              },
            },
            views: {
              where: {
                userId: authUser.id,
              },
            },
            reactions: {
              where: {
                userId: authUser.id,
              },
            },
            _count: {
              select: {
                comments: {
                  where: {
                    deletedAt: null,
                  },
                },
                reactions: true,
                tags: true,
                views: true,
              },
            },
          },
        })
        .then((article) => {
          if (article !== null) {
            const auth: DestroySavedArticleData["article"]["auth"] = {
              savedArticle: null,
              view: null,
              reaction: null,
            };

            if (article.savedArticles.length > 0) {
              auth.savedArticle = article.savedArticles[0];
            }

            if (article.views.length > 0) {
              auth.view = article.views[0];
            }

            if (article.reactions.length > 0) {
              auth.reaction = article.reactions[0] as Reaction;
            }

            return {
              ...article,
              auth,
            };
          } else {
            return null;
          }
        });

    if (articleSavedDeleted === null) {
      return createNotFoundError(event);
    }

    return DestroySavedArticleDataSchema.parse({
      article: articleSavedDeleted,
    });
  },
);
