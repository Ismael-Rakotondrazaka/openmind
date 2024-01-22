import type { User } from "@prisma/client";
import {
  type ShowReactionData,
  type ShowReactionError,
  ShowReactionParamSchema,
  createNotFoundError,
  ReactionSchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<ShowReactionData | ShowReactionError> => {
    const showReactionParamSPR = await safeParseRequestParamAs(
      event,
      ShowReactionParamSchema,
    );

    if (!showReactionParamSPR.success) {
      return createNotFoundError(event);
    }

    const reactionRaw = await event.context.prisma.reaction.findFirst({
      where: {
        id: showReactionParamSPR.data.id,
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
        article: {
          select: {
            isVisible: true,
            deletedAt: true,
            userId: true,
          },
        },
        comment: {
          select: {
            deletedAt: true,
            userId: true,
          },
        },
      },
    });

    const authUser: User | null = await getAuthUser(event);

    if (
      reactionRaw === null ||
      (reactionRaw.article !== null &&
        authUser === null &&
        (reactionRaw.article.deletedAt !== null ||
          reactionRaw.article.isVisible === false)) ||
      (reactionRaw.article !== null &&
        authUser !== null &&
        reactionRaw.article.userId !== authUser.id &&
        authUser.role === "user") ||
      (reactionRaw.comment !== null &&
        authUser === null &&
        reactionRaw.comment.deletedAt !== null) ||
      (reactionRaw.comment !== null &&
        authUser !== null &&
        reactionRaw.comment.userId !== authUser.id &&
        authUser.role === "user")
    ) {
      return createNotFoundError(event);
    }

    const reactionFormatted = {
      ...ReactionSchema.parse(reactionRaw),
      user: reactionRaw.user,
    };

    return {
      reaction: reactionFormatted,
    };
  },
);
