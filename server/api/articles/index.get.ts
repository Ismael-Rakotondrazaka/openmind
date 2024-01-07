import type { SafeParseReturnType } from "zod";
import type { User } from "@prisma/client";
import {
  type IndexArticleData,
  type IndexArticleError,
  type IndexArticleQuery,
  IndexArticleQuerySchema,
  createBadRequestError,
  getRequestErrorMessage,
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
      await event.context.prisma.article.findMany({
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
        },
        orderBy: indexArticleQuerySPR.data.orderBy,
        take: pageSize,
        skip: calculatePaginationSkip(currentPage, pageSize),
      });

    return {
      articles,
      count: articles.length,
      totalCounts,
      page: currentPage,
      pageSize,
      totalPages,
      links,
    };
  },
);
