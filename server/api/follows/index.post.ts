import type { Follow, User } from "@prisma/client";
import {
  type StoreFollowData,
  type StoreFollowError,
  createBadRequestError,
  createUnauthorizedError,
  getRequestErrorMessage,
  StoreFollowDataSchema,
  StoreFollowBodySchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<StoreFollowData | StoreFollowError> => {
    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    const storeFollowBodySPR = await safeParseRequestBodyAs(
      event,
      StoreFollowBodySchema,
    );

    if (!storeFollowBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(storeFollowBodySPR),
      });
    }

    if (storeFollowBodySPR.data.userId === authUser.id) {
      return createBadRequestError(event, {
        errorMessage: {
          userId: "You cannot follow yourself.",
        },
      });
    }

    const user: (User & { followers: Follow[] }) | null =
      await event.context.prisma.user.findFirst({
        where: {
          id: storeFollowBodySPR.data.userId,
          deletedAt: null,
        },
        include: {
          followers: {
            where: {
              followerId: authUser.id,
            },
          },
        },
      });

    if (user === null) {
      return createBadRequestError(event, {
        errorMessage: {
          userId: "The user does not exists.",
        },
      });
    }

    if (user.followers.length > 0) {
      return createBadRequestError(event, {
        errorMessage: {
          userId: "You already follow this user.",
        },
      });
    }

    const now: Date = new Date();

    const follow: StoreFollowData["follow"] =
      await event.context.prisma.follow.create({
        data: {
          followerId: authUser.id,
          followingId: user.id,
          createdAt: now,
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
      });

    return StoreFollowDataSchema.parse({
      follow,
    });
  },
);
