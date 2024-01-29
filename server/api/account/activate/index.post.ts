import type { ActivationToken, User } from "@prisma/client";
import {
  createBadRequestError,
  getRequestErrorMessage,
  type StoreAccountActivateData,
  type StoreAccountActivateError,
  StoreAccountActivateBodySchema,
} from "~/utils";

export default defineEventHandler(
  async (
    event,
  ): Promise<StoreAccountActivateData | StoreAccountActivateError> => {
    const storeAccountActivateBodySPR = await safeParseRequestBodyAs(
      event,
      StoreAccountActivateBodySchema,
    );

    if (!storeAccountActivateBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(storeAccountActivateBodySPR),
      });
    }
    const activationToken: (ActivationToken & { user: User }) | null =
      await event.context.prisma.activationToken.findUnique({
        where: {
          token: storeAccountActivateBodySPR.data.t,
        },
        include: {
          user: true,
        },
      });

    if (activationToken === null) {
      return createBadRequestError(event, {
        message: "The link is broken or not valid.",
        errorMessage: {
          t: "The link is broken or not valid.",
        },
      });
    }

    const now = new Date();

    // check if the token is active
    if (activationToken.expiresAt < now) {
      await event.context.prisma.activationToken.delete({
        where: {
          token: storeAccountActivateBodySPR.data.t,
        },
      });

      return createBadRequestError(event, {
        message: "The link is broken or not valid.",
        errorMessage: {
          t: "The link is broken or not valid.",
        },
      });
    }

    await event.context.prisma.user.update({
      where: {
        id: activationToken.userId,
      },
      data: {
        emailVerifiedAt: now,
        updatedAt: now,
      },
    });

    await event.context.prisma.activationToken.delete({
      where: {
        token: storeAccountActivateBodySPR.data.t,
      },
    });

    sendAccountActivated({
      email: activationToken.user.email,
      firstName: activationToken.user.firstName,
    });

    return {
      message: "Account successfully activated.",
    };
  },
);
