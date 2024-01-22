import type { User } from "@prisma/client";
import {
  type UpdateReactionData,
  type UpdateReactionError,
  createBadRequestError,
  createUnauthorizedError,
  createNotFoundError,
  createForbiddenError,
  getRequestErrorMessage,
  UpdateReactionParamSchema,
  UpdateReactionBodySchema,
  ReactionSchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<UpdateReactionData | UpdateReactionError> => {
    const updateReactionParamSPR = await safeParseRequestParamAs(
      event,
      UpdateReactionParamSchema,
    );

    if (!updateReactionParamSPR.success) {
      return createNotFoundError(event);
    }

    const article = await event.context.prisma.reaction.findFirst({
      where: {
        id: updateReactionParamSPR.data.id,
      },
    });

    if (article === null) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    if (authUser.id !== article.userId) {
      return createForbiddenError(event);
    }

    const updateReactionBodySPR = await safeParseRequestBodyAs(
      event,
      UpdateReactionBodySchema,
    );

    if (!updateReactionBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(updateReactionBodySPR),
      });
    }

    // Check if one change is made
    if (updateReactionBodySPR.data.type === article.type) {
      return createBadRequestError(event, {
        message: "At least one change is required.",
        errorMessage: {},
      });
    }

    const now: Date = new Date();

    const updatedReactionRaw = await event.context.prisma.reaction.update({
      where: {
        id: article.id,
      },
      data: {
        type: updateReactionBodySPR.data.type,
        createdAt: now,
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
      },
    });

    const updatedReactionFormatted: UpdateReactionData["reaction"] = {
      ...ReactionSchema.parse(updatedReactionRaw),
      user: updatedReactionRaw.user,
    };

    return {
      reaction: updatedReactionFormatted,
    };
  },
);
