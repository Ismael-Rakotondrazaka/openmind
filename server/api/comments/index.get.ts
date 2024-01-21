import type { User } from "@prisma/client";
import {
  type IndexCommentData,
  type IndexCommentError,
  IndexCommentQuerySchema,
  createBadRequestError,
  getRequestErrorMessage,
} from "~/utils";
import { safeParseRequestQueryAs } from "~/server/utils";

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

    const totalCounts: number = await event.context.prisma.comment.count({
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
      await event.context.prisma.comment.findMany({
        where: {
          ...indexCommentQuerySPR.data.where,
          deletedAt:
            authUser !== null &&
            (authUser.role !== "user" ||
              indexCommentQuerySPR.data.where?.userId === authUser.id)
              ? indexCommentQuerySPR.data.where?.deletedAt
              : null,
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
          _count: {
            select: {
              replies: {
                where: {
                  deletedAt: null,
                },
              },
            },
          },
        },
        orderBy: indexCommentQuerySPR.data.orderBy,
        take: pageSize,
        skip: calculatePaginationSkip(currentPage, pageSize),
      });

    return {
      comments,
      count: comments.length,
      totalCounts,
      page: currentPage,
      pageSize,
      totalPages,
      links,
    };
  },
);
