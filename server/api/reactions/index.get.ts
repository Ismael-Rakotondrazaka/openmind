import type { SafeParseReturnType } from "zod";
import { reactionRepository } from "~/repositories";
import {
  type IndexReactionData,
  type IndexReactionError,
  type IndexReactionQuery,
  IndexReactionQuerySchema,
  createBadRequestError,
  getRequestErrorMessage,
  IndexReactionDataSchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<IndexReactionData | IndexReactionError> => {
    const indexReactionQuerySPR: SafeParseReturnType<
      IndexReactionQuery,
      IndexReactionQuery
    > = await safeParseRequestQueryAs(event, IndexReactionQuerySchema);

    if (!indexReactionQuerySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(indexReactionQuerySPR),
      });
    }

    const totalCounts: number = await reactionRepository.count({
      where: indexReactionQuerySPR.data.where,
      orderBy: indexReactionQuerySPR.data.orderBy,
    });

    const pageSize: number = indexReactionQuerySPR.data.pageSize;

    const totalPages: number = Math.ceil(
      totalCounts / indexReactionQuerySPR.data.pageSize,
    );

    const currentPage: number = indexReactionQuerySPR.data.page;

    const links: PaginationLinks = makePaginationLinks(
      event,
      currentPage,
      totalPages,
      pageSize,
    );

    const reactions: IndexReactionData["reactions"] =
      await reactionRepository.findFullMany({
        where: indexReactionQuerySPR.data.where,
        orderBy: indexReactionQuerySPR.data.orderBy,
        take: pageSize,
        skip: calculatePaginationSkip(currentPage, pageSize),
      });

    return IndexReactionDataSchema.parse({
      reactions,
      count: reactions.length,
      totalCounts,
      page: currentPage,
      pageSize,
      totalPages,
      links,
    });
  },
);
