import type { ActivationToken, User } from "@prisma/client";
import { activationTokenRepository, userRepository } from "~/repositories";
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
    const activationToken: ActivationToken | null =
      await activationTokenRepository.findOne({
        where: {
          token: storeAccountActivateBodySPR.data.t,
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
      await activationTokenRepository.deleteOne({
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

    await userRepository.updateOne({
      where: {
        id: activationToken.userId,
      },
      data: {
        emailVerifiedAt: now,
        updatedAt: now,
      },
    });

    await activationTokenRepository.deleteOne({
      where: {
        token: storeAccountActivateBodySPR.data.t,
      },
    });

    const user: User = await userRepository.findOneOrThrow({
      where: {
        id: activationToken.userId,
      },
    });

    sendAccountActivated({
      email: user.email,
      firstName: user.firstName,
    });

    return {
      message: "Account successfully activated.",
    };
  },
);
