import type { User } from "@prisma/client";
import {
  type IndexCommentData,
  type IndexCommentError,
  IndexCommentQuerySchema,
  createBadRequestError,
  getRequestErrorMessage,
  IndexCommentDataSchema,
} from "~/utils";
import { safeParseRequestQueryAs } from "~/server/utils";
import { commentRepository } from "~/repositories";

export default defineEventHandler(
  async (event): Promise<IndexCommentData | IndexCommentError> => {
    const indexCommentQuerySPR = await safeParseRequestQueryAs(
      event,
      IndexCommentQuerySchema,
    );

    if (!indexCommentQuerySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(indexCommentQuerySPR),
      });
    }

    const authUser: User | null = await getAuthUser(event);

    const totalCounts: number = await commentRepository.count({
      where: {
        ...indexCommentQuerySPR.data.where,
        deletedAt:
          authUser !== null &&
          (authUser.role !== "user" ||
            indexCommentQuerySPR.data.where?.userId === authUser.id)
            ? indexCommentQuerySPR.data.where?.deletedAt
            : null,
      },
      orderBy: indexCommentQuerySPR.data.orderBy,
    });

    const pageSize: number = indexCommentQuerySPR.data.pageSize;

    const totalPages: number = Math.ceil(
      totalCounts / indexCommentQuerySPR.data.pageSize,
    );

    const currentPage: number = indexCommentQuerySPR.data.page;

    const links: PaginationLinks = makePaginationLinks(
      event,
      currentPage,
      totalPages,
      pageSize,
    );

    const comments: IndexCommentData["comments"] =
      await commentRepository.findFullMany({
        where: {
          ...indexCommentQuerySPR.data.where,
          deletedAt:
            authUser !== null &&
            (authUser.role !== "user" ||
              indexCommentQuerySPR.data.where?.userId === authUser.id)
              ? indexCommentQuerySPR.data.where?.deletedAt
              : null,
        },
        orderBy: indexCommentQuerySPR.data.orderBy,
        take: pageSize,
        skip: calculatePaginationSkip(currentPage, pageSize),
        authUser,
      });

    return IndexCommentDataSchema.parse({
      comments,
      count: comments.length,
      totalCounts,
      page: currentPage,
      pageSize,
      totalPages,
      links,
    });
  },
);
