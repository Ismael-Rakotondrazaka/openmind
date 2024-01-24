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

    const totalCounts: number = await event.context.prisma.view.count({
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

    const views: IndexViewData["views"] =
      await event.context.prisma.view.findMany({
        where: indexViewQuerySPR.data.where,
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
