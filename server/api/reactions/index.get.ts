import type { SafeParseReturnType } from "zod";
import {
  type IndexReactionData,
  type IndexReactionError,
  type IndexReactionQuery,
  IndexReactionQuerySchema,
  createBadRequestError,
  getRequestErrorMessage,
  ReactionSchema,
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

    const totalCounts: number = await event.context.prisma.reaction.count({
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
      await event.context.prisma.reaction
        .findMany({
          where: indexReactionQuerySPR.data.where,
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
          orderBy: indexReactionQuerySPR.data.orderBy,
          take: pageSize,
          skip: calculatePaginationSkip(currentPage, pageSize),
        })
        .then((reactions) =>
          reactions.map((reaction) => {
            return {
              ...ReactionSchema.parse(reaction),
              user: reaction.user,
            };
          }),
        );

    return {
      reactions,
      count: reactions.length,
      totalCounts,
      page: currentPage,
      pageSize,
      totalPages,
      links,
    };
  },
);
