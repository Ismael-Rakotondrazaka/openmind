import type { Reaction, User } from "@prisma/client";
import { reactionRepository } from "~/repositories";
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
  UpdateReactionDataSchema,
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

    const article: Reaction | null = await reactionRepository.findOne({
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

    const updatedReaction: UpdateReactionData["reaction"] =
      await reactionRepository.updateFullOne({
        where: {
          id: article.id,
        },
        data: {
          type: updateReactionBodySPR.data.type,
          createdAt: now,
        },
      });

    return UpdateReactionDataSchema.parse({
      reaction: updatedReaction,
    });
  },
);
