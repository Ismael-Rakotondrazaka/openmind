import { userRepository, passwordResetTokenRepository } from "~/repositories";
import {
  type StorePasswordResetRequestData,
  type StorePasswordResetRequestError,
  createBadRequestError,
  getRequestErrorMessage,
  StorePasswordResetRequestBodySchema,
  passwordConfig,
} from "~/utils";
import { useDayjs } from "~/composables";

export default defineEventHandler(
  async (
    event,
  ): Promise<
    StorePasswordResetRequestData | StorePasswordResetRequestError
  > => {
    const storePasswordResetRequestBodySPR = await safeParseRequestBodyAs(
      event,
      StorePasswordResetRequestBodySchema,
    );

    if (!storePasswordResetRequestBodySPR.success) {
      return createBadRequestError(event, {
        message: "Credentials not found",
        errorMessage: getRequestErrorMessage(storePasswordResetRequestBodySPR),
      });
    }

    const user = await userRepository.findOne({
      where: {
        deletedAt: null,
        OR: [
          {
            email: storePasswordResetRequestBodySPR.data.emailOrUsername,
          },
          {
            username: storePasswordResetRequestBodySPR.data.emailOrUsername,
          },
        ],
      },
    });

    if (user === null) {
      return createBadRequestError(event, {
        message: "Credentials not found",
        errorMessage: {
          emailOrUsername: "Credentials not found",
        },
      });
    }

    const now = new Date();

    const passwordResetToken = await passwordResetTokenRepository.findOne({
      where: {
        userId: user.id,
      },
    });

    if (passwordResetToken !== null) {
      if (passwordResetToken.expiresAt.getTime() >= now.getTime()) {
        return createBadRequestError(event, {
          message:
            "A password reset request was already made. Try again later.",
          errorMessage: {},
        });
      } else {
        await passwordResetTokenRepository.deleteOne({
          where: {
            token: passwordResetToken.token,
          },
        });
      }
    }

    const token = createRandomString(passwordConfig.PASSWORD_RESET_TOKEN_SIZE);
    const dayjs = useDayjs();
    const expiresAt: Date = dayjs()
      .add(passwordConfig.PASSWORD_RESET_TOKEN_VALIDITY, "milliseconds")
      .toDate();

    await passwordResetTokenRepository.createOne({
      data: {
        token,
        expiresAt,
        userId: user.id,
      },
    });

    const runtimeConfig = useRuntimeConfig(event);

    sendPasswordResetLink({
      passwordResetLink: `${runtimeConfig.public.appUrl}/password/reset?t=${token}`,
      email: user.email,
      firstName: user.firstName,
    });

    return {
      message: "Password reset request sent",
    };
  },
);
