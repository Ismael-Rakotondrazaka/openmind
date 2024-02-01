import type { User } from "@prisma/client";
import { reactionRepository } from "~/repositories";
import {
  type DestroyReactionData,
  type DestroyReactionError,
  DestroyReactionParamSchema,
  createNotFoundError,
  createUnauthorizedError,
  createForbiddenError,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<DestroyReactionData | DestroyReactionError> => {
    const destroyReactionParamSPR = await safeParseRequestParamAs(
      event,
      DestroyReactionParamSchema,
    );

    if (!destroyReactionParamSPR.success) {
      return createNotFoundError(event);
    }

    const reaction: DestroyReactionData["reaction"] | null =
      await reactionRepository.findFullOne({
        where: {
          id: destroyReactionParamSPR.data.id,
        },
      });

    if (reaction === null) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    if (authUser.id !== reaction.userId && authUser.role === "user") {
      return createForbiddenError(event);
    }

    await reactionRepository.deleteOne({
      where: {
        id: reaction.id,
      },
    });

    return {
      reaction,
    };
  },
);
