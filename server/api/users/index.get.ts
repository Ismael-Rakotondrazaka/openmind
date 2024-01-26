import type { User } from "@prisma/client";
import {
  type IndexUserData,
  type IndexUserError,
  IndexUserQuerySchema,
  createBadRequestError,
  getRequestErrorMessage,
  IndexUserDataSchema,
  type Follow,
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

    /* eslint-disable indent */
    const totalCounts: number = await event.context.prisma.user.count({
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
    /* eslint-enable indent */

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

    /* eslint-disable indent */
    const users: IndexUserData["users"] = await event.context.prisma.user
      .findMany({
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
        include: {
          followers:
            authUser === null
              ? undefined
              : {
                  where: {
                    followerId: authUser.id,
                  },
                  include: {
                    follower: {
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
                    following: {
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
                },
          following:
            authUser === null
              ? undefined
              : {
                  where: {
                    followingId: authUser.id,
                  },
                  include: {
                    follower: {
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
                    following: {
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
                },
          tags: true,
          _count: {
            select: {
              followers: true,
              following: true,
              /* eslint-enable indent */
              tags: true,
              articles: {
                where: {
                  deletedAt: null,
                  isVisible: true,
                },
              },
            },
          },
        },
        orderBy: indexUserQuerySPR.data.orderBy,
        take: pageSize,
        skip: calculatePaginationSkip(currentPage, pageSize),
      })
      .then((users) => {
        if (authUser !== null) {
          return users.map((user) => {
            const auth: IndexUserData["users"][0]["auth"] = {
              follower: null,
              following: null,
            };

            if (user.followers !== undefined && user.followers.length > 0) {
              auth.follower = user.followers[0] as Follow & {
                following: Omit<User, "password" | "email" | "emailVerifiedAt">;
                follower: Omit<User, "password" | "email" | "emailVerifiedAt">;
              };
            }

            if (user.following !== undefined && user.following.length > 0) {
              auth.following = user.following[0] as Follow & {
                following: Omit<User, "password" | "email" | "emailVerifiedAt">;
                follower: Omit<User, "password" | "email" | "emailVerifiedAt">;
              };
            }

            return {
              ...user,
              auth,
            };
          });
        } else {
          return users.map((article) => ({
            ...article,
            auth: null,
          }));
        }
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
