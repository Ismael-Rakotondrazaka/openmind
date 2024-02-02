import type { User } from "@prisma/client";
import { followRepository, userRepository } from "~/repositories";
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

    const user: User | null = await userRepository.findOne({
      where: {
        id: storeFollowBodySPR.data.userId,
        deletedAt: null,
      },
    });

    if (user === null) {
      return createBadRequestError(event, {
        errorMessage: {
          userId: "The user does not exists.",
        },
      });
    }

    const isAlreadyAFollower: boolean = await followRepository.exist({
      where: {
        followingId: user.id,
        followerId: authUser.id,
      },
    });

    if (isAlreadyAFollower) {
      return createBadRequestError(event, {
        errorMessage: {
          userId: "You already follow this user.",
        },
      });
    }

    const now: Date = new Date();

    const follow: StoreFollowData["follow"] =
      await followRepository.createFullOne({
        data: {
          followerId: authUser.id,
          followingId: user.id,
          createdAt: now,
        },
      });

    return StoreFollowDataSchema.parse({
      follow,
    });
  },
);
