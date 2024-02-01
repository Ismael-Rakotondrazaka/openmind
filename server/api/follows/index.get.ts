import {
  type IndexFollowData,
  type IndexFollowError,
  IndexFollowQuerySchema,
  createBadRequestError,
  getRequestErrorMessage,
  IndexFollowDataSchema,
} from "~/utils";
import { safeParseRequestQueryAs } from "~/server/utils";
import { followRepository } from "~/repositories";

export default defineEventHandler(
  async (event): Promise<IndexFollowData | IndexFollowError> => {
    const indexFollowQuerySPR = await safeParseRequestQueryAs(
      event,
      IndexFollowQuerySchema,
    );

    if (!indexFollowQuerySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(indexFollowQuerySPR),
      });
    }

    const totalCounts: number = await followRepository.count({
      where: indexFollowQuerySPR.data.where,
    });

    const pageSize: number = indexFollowQuerySPR.data.pageSize;

    const totalPages: number = Math.ceil(
      totalCounts / indexFollowQuerySPR.data.pageSize,
    );

    const currentPage: number = indexFollowQuerySPR.data.page;

    const links: PaginationLinks = makePaginationLinks(
      event,
      currentPage,
      totalPages,
      pageSize,
    );

    const follows: IndexFollowData["follows"] =
      await followRepository.findFullMany({
        where: indexFollowQuerySPR.data.where,
        orderBy: indexFollowQuerySPR.data.orderBy,
        take: pageSize,
        skip: calculatePaginationSkip(currentPage, pageSize),
      });

    return IndexFollowDataSchema.parse({
      follows,
      count: follows.length,
      totalCounts,
      page: currentPage,
      pageSize,
      totalPages,
      links,
    });
  },
);
