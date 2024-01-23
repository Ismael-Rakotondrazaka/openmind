import type { Reaction, User } from "@prisma/client";
import {
  type DestroyReactionData,
  type DestroyReactionError,
  DestroyReactionParamSchema,
  createNotFoundError,
  createUnauthorizedError,
  createForbiddenError,
  ReactionSchema,
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

    /* eslint-disable indent */
    const reaction:
      | (Reaction & {
          user: Omit<User, "password" | "email" | "emailVerifiedAt">;
        })
      | null = await event.context.prisma.reaction.findFirst({
      where: {
        id: destroyReactionParamSPR.data.id,
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
    /* eslint-enable indent */

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

    await event.context.prisma.reaction.delete({
      where: {
        id: reaction.id,
      },
    });

    const deletedReaction: DestroyReactionData["reaction"] = {
      ...ReactionSchema.parse(reaction),
      user: reaction.user,
    };

    return {
      reaction: deletedReaction,
    };
  },
);
