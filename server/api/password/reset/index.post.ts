import { passwordResetTokenRepository, userRepository } from "~/repositories";
import {
  StorePasswordResetBodySchema,
  createBadRequestError,
  createUnauthorizedError,
  getRequestErrorMessage,
  type StorePasswordResetData,
  type StorePasswordResetError,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<StorePasswordResetData | StorePasswordResetError> => {
    const storePasswordResetBodySPR = await safeParseRequestBodyAs(
      event,
      StorePasswordResetBodySchema,
    );

    if (!storePasswordResetBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(storePasswordResetBodySPR),
      });
    }

    const passwordResetToken = await passwordResetTokenRepository.findOne({
      where: {
        token: storePasswordResetBodySPR.data.t,
      },
    });

    if (passwordResetToken === null) {
      return createUnauthorizedError(event, {
        message: "The password reset link is invalid or has expired.",
      });
    } else {
      const now = new Date();
      if (passwordResetToken.expiresAt.getTime() < now.getTime()) {
        return createUnauthorizedError(event, {
          message: "The password reset link is invalid or has expired.",
        });
      }

      await passwordResetTokenRepository.deleteOne({
        where: {
          token: passwordResetToken.token,
        },
      });
    }

    const hashedPassword = hashPassword(
      storePasswordResetBodySPR.data.password,
    );

    await userRepository.updateOne({
      where: {
        id: passwordResetToken.userId,
      },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    return {
      message: "Password reset successfully.",
    };
  },
);
