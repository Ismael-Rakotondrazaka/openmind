import type { User } from "@prisma/client";
import {
  type ShowUserData,
  type ShowUserError,
  ShowUserParamSchema,
  createNotFoundError,
  ShowUserDataSchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<ShowUserData | ShowUserError> => {
    const showUserParamSPR = await safeParseRequestParamAs(
      event,
      ShowUserParamSchema,
    );

    if (!showUserParamSPR.success) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);
    /* eslint-disable indent */
    const user: ShowUserData["user"] | null = await event.context.prisma.user
      .findFirst({
        where: {
          id: showUserParamSPR.data.id,
          emailVerifiedAt: {
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
      })
      .then((user) => {
        if (user !== null) {
          const auth: ShowUserData["user"]["auth"] = {
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
        } else {
          return null;
        }
      });
    /* eslint-enable indent */

    if (user === null || (authUser === null && user.deletedAt !== null)) {
      return createNotFoundError(event);
    }

    return ShowUserDataSchema.parse({
      user,
    });
  },
);
