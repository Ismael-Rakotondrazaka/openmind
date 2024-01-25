import type { User } from "@prisma/client";
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
      await event.context.prisma.follow.findFirst({
        where: {
          id: destroyFollowParamSPR.data.id,
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

    await event.context.prisma.follow.delete({
      where: {
        id: destroyFollowParamSPR.data.id,
      },
    });

    return DestroyFollowDataSchema.parse({
      follow,
    });
  },
);
