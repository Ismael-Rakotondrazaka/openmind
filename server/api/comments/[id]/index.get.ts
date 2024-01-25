import type { User } from "@prisma/client";
import {
  type ShowCommentData,
  type ShowCommentError,
  ShowCommentParamSchema,
  createNotFoundError,
  ShowCommentDataSchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<ShowCommentData | ShowCommentError> => {
    const showCommentParamSPR = await safeParseRequestParamAs(
      event,
      ShowCommentParamSchema,
    );

    if (!showCommentParamSPR.success) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);

    const comment: ShowCommentData["comment"] | null =
      await event.context.prisma.comment
        .findFirst({
          where: {
            id: showCommentParamSPR.data.id,
          },
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
            /* eslint-disable indent */
            reactions:
              authUser === null
                ? undefined
                : {
                    where: {
                      userId: authUser.id,
                    },
                  },
            /* eslint-enable indent */
            _count: {
              select: {
                replies: {
                  where: {
                    deletedAt: null,
                  },
                },
                reactions: true,
              },
            },
          },
        })
        .then((comment) => {
          if (comment !== null) {
            if (authUser !== null) {
              const auth: ShowCommentData["comment"]["auth"] = {
                reaction: null,
              };

              if (comment.reactions.length > 0) {
                auth.reaction = comment.reactions[0] as Reaction;
              }

              return {
                ...comment,
                auth,
              };
            } else {
              return {
                ...comment,
                auth: null,
              };
            }
          } else {
            return null;
          }
        });

    if (
      comment === null ||
      (authUser === null && comment.deletedAt !== null) ||
      (authUser !== null &&
        comment.userId !== authUser.id &&
        authUser.role === "user")
    ) {
      return createNotFoundError(event);
    }

    return ShowCommentDataSchema.parse({
      comment,
    });
  },
);
