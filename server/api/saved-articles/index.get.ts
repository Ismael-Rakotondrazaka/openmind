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
} from "~/utils";
import { safeParseRequestQueryAs } from "~/server/utils";
import { savedArticleRepository } from "~/repositories";

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
    const totalCounts: number = await savedArticleRepository.count({
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
      await savedArticleRepository.findFullMany({
        where: {
          ...indexArticleQuerySPR.data.where,
          userId: authUser.id,
        },
        orderBy: indexArticleQuerySPR.data.orderBy,
        take: pageSize,
        skip: calculatePaginationSkip(currentPage, pageSize),
        authUser,
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
