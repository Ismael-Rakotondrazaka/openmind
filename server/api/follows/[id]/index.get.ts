import {
  type ShowFollowData,
  type ShowFollowError,
  ShowFollowParamSchema,
  createNotFoundError,
  ShowFollowDataSchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<ShowFollowData | ShowFollowError> => {
    const showFollowParamSPR = await safeParseRequestParamAs(
      event,
      ShowFollowParamSchema,
    );

    if (!showFollowParamSPR.success) {
      return createNotFoundError(event);
    }

    const follow: ShowFollowData["follow"] | null =
      await event.context.prisma.follow.findFirst({
        where: {
          id: showFollowParamSPR.data.id,
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

    return ShowFollowDataSchema.parse({
      follow,
    });
  },
);
