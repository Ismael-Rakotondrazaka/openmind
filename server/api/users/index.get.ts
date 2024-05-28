import type { User } from "@prisma/client";
import { userRepository } from "~/repositories";
import {
  IndexUserDataSchema,
  IndexUserQuerySchema,
  createBadRequestError,
  getRequestErrorMessage,
  type IndexUserData,
  type IndexUserError,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<IndexUserData | IndexUserError> => {
    const indexUserQuerySPR = await safeParseRequestQueryAs(
      event,
      IndexUserQuerySchema,
    );

    if (!indexUserQuerySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(indexUserQuerySPR),
      });
    }

    const authUser: User | null = await getAuthUser(event);

    const totalCounts: number = await userRepository.count({
      where: {
        ...indexUserQuerySPR.data.where,
        deletedAt:
          authUser !== null && authUser.role !== "user"
            ? indexUserQuerySPR.data.where?.deletedAt
            : null,
        emailVerifiedAt:
          authUser !== null && authUser.role !== "user"
            ? indexUserQuerySPR.data.where?.emailVerifiedAt
            : {
                not: null,
              },
      },
    });

    const pageSize: number = indexUserQuerySPR.data.pageSize;

    const totalPages: number = Math.ceil(
      totalCounts / indexUserQuerySPR.data.pageSize,
    );

    const currentPage: number = indexUserQuerySPR.data.page;

    const links: PaginationLinks = makePaginationLinks(
      event,
      currentPage,
      totalPages,
      pageSize,
    );

    const users: IndexUserData["users"] = await userRepository.findFullMany({
      where: {
        ...indexUserQuerySPR.data.where,
        deletedAt:
          authUser !== null && authUser.role !== "user"
            ? indexUserQuerySPR.data.where?.deletedAt
            : null,
        emailVerifiedAt:
          authUser !== null && authUser.role !== "user"
            ? indexUserQuerySPR.data.where?.emailVerifiedAt
            : {
                not: null,
              },
      },
      orderBy: indexUserQuerySPR.data.orderBy,
      take: pageSize,
      skip: calculatePaginationSkip(currentPage, pageSize),
      authUser,
    });

    return IndexUserDataSchema.parse({
      users,
      count: users.length,
      totalCounts,
      page: currentPage,
      pageSize,
      totalPages,
      links,
    });
  },
);
