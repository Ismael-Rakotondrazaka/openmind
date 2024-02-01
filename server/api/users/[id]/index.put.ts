import type { SafeParseReturnType } from "zod";
import type { User } from "@prisma/client";
import {
  type UpdateUserData,
  type UpdateUserError,
  type UpdateUserParam,
  createBadRequestError,
  createUnauthorizedError,
  createNotFoundError,
  createForbiddenError,
  getRequestErrorMessage,
  UpdateUserParamSchema,
  UpdateUserDataSchema,
} from "~/utils";
import { UpdateUserBodySchema } from "~/server/utils";
import { userRepository } from "~/repositories";

export default defineEventHandler(
  async (event): Promise<UpdateUserData | UpdateUserError> => {
    const updateArticleParamSPR: SafeParseReturnType<
      UpdateUserParam,
      UpdateUserParam
    > = await safeParseRequestParamAs(event, UpdateUserParamSchema);

    if (!updateArticleParamSPR.success) {
      return createNotFoundError(event);
    }

    const user: User | null = await userRepository.findOne({
      where: {
        id: updateArticleParamSPR.data.id,
      },
    });

    if (user === null) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    if (authUser.id !== user.id) {
      return createForbiddenError(event);
    }

    const updateArticleBodySPR = await safeParseRequestBodyAs(
      event,
      UpdateUserBodySchema,
    );

    if (!updateArticleBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(updateArticleBodySPR),
      });
    }

    // Check if one change is made
    if (
      !(
        (updateArticleBodySPR.data.name !== undefined &&
          updateArticleBodySPR.data.name !== user.name) ||
        (updateArticleBodySPR.data.firstName !== undefined &&
          updateArticleBodySPR.data.firstName !== user.firstName) ||
        (updateArticleBodySPR.data.profile !== undefined &&
          updateArticleBodySPR.data.profile !== user.profileUrl)
      )
    ) {
      return createBadRequestError(event, {
        message: "At least one change is required.",
        errorMessage: {},
      });
    }

    let newName: string | undefined;
    if (
      updateArticleBodySPR.data.name !== undefined &&
      updateArticleBodySPR.data.name !== user.name
    ) {
      newName = sanitize(updateArticleBodySPR.data.name);
    }

    let newFirstName: string | undefined;
    if (
      updateArticleBodySPR.data.firstName !== undefined &&
      updateArticleBodySPR.data.firstName !== user.firstName
    ) {
      newFirstName = sanitize(updateArticleBodySPR.data.firstName);
    }

    const now: Date = new Date();

    let newProfileUrl: string | null | undefined;
    if (updateArticleBodySPR.data.profile === null) {
      newProfileUrl = null;
      deleteFilesInFolder({
        folderPath: `public/users/${user.id}/profile`,
      });
    } else if (updateArticleBodySPR.data.profile !== undefined) {
      newProfileUrl = saveUserProfile({
        file: updateArticleBodySPR.data.profile,
        userId: user.id,
      });
    }
    /* eslint-disable indent */
    const updatedUser: UpdateUserData["user"] = await event.context.prisma.user
      .update({
        where: {
          id: user.id,
        },
        data: {
          name: newName,
          firstName: newFirstName,
          profileUrl: newProfileUrl,
          updatedAt: now,
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
      });
    /* eslint-enable indent */

    return UpdateUserDataSchema.parse({
      user: updatedUser,
    });
  },
);
