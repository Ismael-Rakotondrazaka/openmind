import type { User } from "@prisma/client";
import { followRepository } from "~/repositories";
import {
  type DestroyFollowData,
  type DestroyFollowError,
  DestroyFollowParamSchema,
  createNotFoundError,
  createUnauthorizedError,
  createForbiddenError,
  DestroyFollowDataSchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<DestroyFollowData | DestroyFollowError> => {
    const destroyFollowParamSPR = await safeParseRequestParamAs(
      event,
      DestroyFollowParamSchema,
    );

    if (!destroyFollowParamSPR.success) {
      return createNotFoundError(event);
    }

    const follow: DestroyFollowData["follow"] | null =
      await followRepository.findFullOne({
        where: {
          id: destroyFollowParamSPR.data.id,
        },
      });

    if (follow === null) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    if (authUser.id !== follow.followerId && authUser.role === "user") {
      return createForbiddenError(event);
    }

    await followRepository.deleteOne({
      where: {
        id: destroyFollowParamSPR.data.id,
      },
    });

    return DestroyFollowDataSchema.parse({
      follow,
    });
  },
);
