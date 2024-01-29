import type { SafeParseReturnType } from "zod";
import type { Article, User } from "@prisma/client";
import {
  createNotFoundError,
  createUnauthorizedError,
  createForbiddenError,
  type Reaction,
  type DestroyArticleData,
  type DestroyArticleError,
  type DestroyArticleParam,
  DestroyArticleParamSchema,
  DestroyArticleDataSchema,
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
      await event.context.prisma.article
        .update({
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
          const auth: StoreArticleData["article"]["auth"] = {
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
        });

    return DestroyArticleDataSchema.parse({
      article: deletedArticle,
    });
  },
);
