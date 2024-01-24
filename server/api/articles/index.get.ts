import type { SafeParseReturnType } from "zod";
import type { User } from "@prisma/client";
import {
  type IndexArticleData,
  type IndexArticleError,
  type IndexArticleQuery,
  IndexArticleQuerySchema,
  createBadRequestError,
  getRequestErrorMessage,
  IndexArticleDataSchema,
} from "~/utils";
import { safeParseRequestQueryAs } from "~/server/utils";

export default defineEventHandler(
  async (event): Promise<IndexArticleData | IndexArticleError> => {
    const indexArticleQuerySPR: SafeParseReturnType<
      IndexArticleQuery,
      IndexArticleQuery
    > = await safeParseRequestQueryAs(event, IndexArticleQuerySchema);

    if (!indexArticleQuerySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(indexArticleQuerySPR),
      });
    }

    const authUser: User | null = await getAuthUser(event);

    const totalCounts: number = await event.context.prisma.article.count({
      where: {
        ...indexArticleQuerySPR.data.where,
        deletedAt:
          authUser !== null &&
          (authUser.role !== "user" ||
            indexArticleQuerySPR.data.where?.userId === authUser.id)
            ? indexArticleQuerySPR.data.where?.deletedAt
            : null,
        isVisible:
          authUser !== null &&
          (authUser.role !== "user" ||
            indexArticleQuerySPR.data.where?.userId === authUser.id)
            ? indexArticleQuerySPR.data.where?.isVisible
            : true,
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

    const articles: IndexArticleData["articles"] =
      await event.context.prisma.article
        .findMany({
          where: {
            ...indexArticleQuerySPR.data.where,
            deletedAt:
              authUser !== null &&
              (authUser.role !== "user" ||
                indexArticleQuerySPR.data.where?.userId === authUser.id)
                ? indexArticleQuerySPR.data.where?.deletedAt
                : null,
            isVisible:
              authUser !== null &&
              (authUser.role !== "user" ||
                indexArticleQuerySPR.data.where?.userId === authUser.id)
                ? indexArticleQuerySPR.data.where?.isVisible
                : true,
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
            /* eslint-disable indent */
            savedArticles:
              authUser === null
                ? undefined
                : {
                    where: {
                      userId: authUser.id,
                    },
                  },
            views:
              authUser === null
                ? undefined
                : {
                    where: {
                      userId: authUser.id,
                    },
                  },
            /* eslint-enable indent */
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
          orderBy: indexArticleQuerySPR.data.orderBy,
          take: pageSize,
          skip: calculatePaginationSkip(currentPage, pageSize),
        })
        .then((articles) => {
          if (authUser !== null) {
            return articles.map((article) => {
              const auth: IndexArticleData["articles"][0]["auth"] = {
                savedArticle: null,
                view: null,
              };

              if (article.savedArticles.length > 0) {
                auth.savedArticle = article.savedArticles[0];
              }

              if (article.views.length > 0) {
                auth.view = article.views[0];
              }

              return {
                ...article,
                auth,
              };
            });
          } else {
            return articles.map((article) => ({
              ...article,
              auth: null,
            }));
          }
        });

    return IndexArticleDataSchema.parse({
      articles,
      count: articles.length,
      totalCounts,
      page: currentPage,
      pageSize,
      totalPages,
      links,
    });
  },
);
