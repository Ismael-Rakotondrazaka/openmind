import type { SafeParseReturnType } from "zod";
import type { User } from "@prisma/client";
import {
  type IndexSavedArticleData,
  type IndexSavedArticleError,
  type IndexSavedArticleQuery,
  IndexSavedArticleQuerySchema,
  createBadRequestError,
  getRequestErrorMessage,
  IndexSavedArticleDataSchema,
  type Reaction,
} from "~/utils";
import { safeParseRequestQueryAs } from "~/server/utils";

export default defineEventHandler(
  async (event): Promise<IndexSavedArticleData | IndexSavedArticleError> => {
    const indexArticleQuerySPR: SafeParseReturnType<
      IndexSavedArticleQuery,
      IndexSavedArticleQuery
    > = await safeParseRequestQueryAs(event, IndexSavedArticleQuerySchema);

    if (!indexArticleQuerySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(indexArticleQuerySPR),
      });
    }

    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    // TODO how about deleted and invisible article
    const totalCounts: number = await event.context.prisma.savedArticle.count({
      where: {
        ...indexArticleQuerySPR.data.where,
        userId: authUser.id,
      },
      orderBy: indexArticleQuerySPR.data.orderBy,
    });

    const pageSize: number = indexArticleQuerySPR.data.pageSize;

    const totalPages: number = Math.ceil(
      totalCounts / indexArticleQuerySPR.data.pageSize,
    );

    const currentPage: number = indexArticleQuerySPR.data.page;

    const links: PaginationLinks = makePaginationLinks(
      event,
      currentPage,
      totalPages,
      pageSize,
    );

    const savedArticles: IndexSavedArticleData["savedArticles"] =
      await event.context.prisma.savedArticle
        .findMany({
          where: {
            ...indexArticleQuerySPR.data.where,
            userId: authUser.id,
          },
          include: {
            article: {
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
            },
          },
          orderBy: indexArticleQuerySPR.data.orderBy,
          take: pageSize,
          skip: calculatePaginationSkip(currentPage, pageSize),
        })
        .then((savedArticles) => {
          return savedArticles.map((savedArticle) => {
            const auth: IndexSavedArticleData["savedArticles"][0]["article"]["auth"] =
              {
                savedArticle: null,
                view: null,
                reaction: null,
              };

            if (savedArticle.article.savedArticles.length > 0) {
              auth.savedArticle = savedArticle.article.savedArticles[0];
            }

            if (savedArticle.article.views.length > 0) {
              auth.view = savedArticle.article.views[0];
            }

            if (savedArticle.article.reactions.length > 0) {
              auth.reaction = savedArticle.article.reactions[0] as Reaction;
            }

            return {
              ...savedArticle,
              article: {
                ...savedArticle.article,
                auth,
              },
            };
          });
        });

    return IndexSavedArticleDataSchema.parse({
      savedArticles,
      count: savedArticles.length,
      totalCounts,
      page: currentPage,
      pageSize,
      totalPages,
      links,
    });
  },
);
