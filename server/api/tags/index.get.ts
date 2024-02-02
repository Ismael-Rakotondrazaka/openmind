import type { SafeParseReturnType } from "zod";
import {
  type IndexTagData,
  type IndexTagError,
  type IndexTagQuery,
  IndexTagQuerySchema,
  createBadRequestError,
  getRequestErrorMessage,
} from "~/utils";
import { safeParseRequestQueryAs } from "~/server/utils";
import { tagRepository } from "~/repositories/tags";

export default defineEventHandler(
  async (event): Promise<IndexTagData | IndexTagError> => {
    const indexTagQuerySPR: SafeParseReturnType<IndexTagQuery, IndexTagQuery> =
      await safeParseRequestQueryAs(event, IndexTagQuerySchema);

    if (!indexTagQuerySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(indexTagQuerySPR),
      });
    }

    const totalCounts: number = await tagRepository.count({
      where: indexTagQuerySPR.data.where,
      orderBy: indexTagQuerySPR.data.orderBy,
    });

    const pageSize: number = indexTagQuerySPR.data.pageSize;

    const totalPages: number = Math.ceil(
      totalCounts / indexTagQuerySPR.data.pageSize,
    );

    const currentPage: number = indexTagQuerySPR.data.page;

    const links: PaginationLinks = makePaginationLinks(
      event,
      currentPage,
      totalPages,
      pageSize,
    );

    const tags: IndexTagData["tags"] = await tagRepository.findMany({
      where: indexTagQuerySPR.data.where,
      orderBy: indexTagQuerySPR.data.orderBy,
      take: pageSize,
      skip: calculatePaginationSkip(currentPage, pageSize),
    });

    return {
      tags,
      count: tags.length,
      totalCounts,
      page: currentPage,
      pageSize,
      totalPages,
      links,
    };
  },
);
