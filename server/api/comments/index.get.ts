import type { User } from "@prisma/client";
import {
  type IndexCommentData,
  type IndexCommentError,
  IndexCommentQuerySchema,
  createBadRequestError,
  getRequestErrorMessage,
  type Reaction,
  IndexCommentDataSchema,
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
      await event.context.prisma.comment
        .findMany({
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
            /* eslint-disable indent */
            reactions:
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
                replies: {
                  where: {
                    deletedAt: null,
                  },
                },
                reactions: true,
              },
            },
          },
          orderBy: indexCommentQuerySPR.data.orderBy,
          take: pageSize,
          skip: calculatePaginationSkip(currentPage, pageSize),
        })
        .then((comments) => {
          if (authUser !== null) {
            return comments.map((comment) => {
              const auth: IndexCommentData["comments"][0]["auth"] = {
                reaction: null,
              };

              if (comment.reactions.length > 0) {
                auth.reaction = comment.reactions[0] as Reaction;
              }

              return {
                ...comment,
                auth,
              };
            });
          } else {
            return comments.map((article) => ({
              ...article,
              auth: null,
            }));
          }
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
