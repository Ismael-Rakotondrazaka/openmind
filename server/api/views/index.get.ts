import { viewRepository } from "~/repositories";
import {
  type IndexViewData,
  type IndexViewError,
  IndexViewQuerySchema,
  createBadRequestError,
  getRequestErrorMessage,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<IndexViewData | IndexViewError> => {
    const indexViewQuerySPR = await safeParseRequestQueryAs(
      event,
      IndexViewQuerySchema,
    );

    if (!indexViewQuerySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(indexViewQuerySPR),
      });
    }

    const totalCounts: number = await viewRepository.count({
      where: indexViewQuerySPR.data.where,
    });

    const pageSize: number = indexViewQuerySPR.data.pageSize;

    const totalPages: number = Math.ceil(
      totalCounts / indexViewQuerySPR.data.pageSize,
    );

    const currentPage: number = indexViewQuerySPR.data.page;

    const links: PaginationLinks = makePaginationLinks(
      event,
      currentPage,
      totalPages,
      pageSize,
    );

    const views: IndexViewData["views"] = await viewRepository.findFullMany({
      where: indexViewQuerySPR.data.where,
      orderBy: indexViewQuerySPR.data.orderBy,
      take: pageSize,
      skip: calculatePaginationSkip(currentPage, pageSize),
    });

    return {
      views,
      count: views.length,
      totalCounts,
      page: currentPage,
      pageSize,
      totalPages,
      links,
    };
  },
);
