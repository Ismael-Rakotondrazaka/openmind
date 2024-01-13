import { zfd } from "zod-form-data";
import type { z } from "zod";
import type { User } from "@prisma/client";
import {
  type StoreRegisterData,
  type StoreRegisterError,
  type StoreRegisterBodyPEM,
  StoreRegisterBodySchema,
  createBadRequestError,
  userConfig,
  authConfig,
  getRequestErrorMessage,
} from "~/utils";
import { useDayjs } from "~/composables";

export default defineEventHandler(
  async (event): Promise<StoreRegisterData | StoreRegisterError> => {
    const runtimeConfig = useRuntimeConfig();

    const requestBody: unknown = await getRequestBody(event);

    const storeRegisterBodySPR = await zfd
      .formData(StoreRegisterBodySchema)
      .safeParseAsync(requestBody);

    if (!storeRegisterBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(
          storeRegisterBodySPR as z.SafeParseError<StoreRegisterBody>,
        ),
      });
    }

    let isAccountUsed: boolean = false;

    const errorMessage: StoreRegisterBodyPEM = {};

    const usedEmailCount: number = await event.context.prisma.user.count({
      where: {
        email: storeRegisterBodySPR.data.email,
      },
    });

    if (usedEmailCount > 0) {
      isAccountUsed = true;

      errorMessage.email =
        "The email address is already associated with an account.";
    }

    const usedUsernameCount: number = await event.context.prisma.user.count({
      where: {
        username: storeRegisterBodySPR.data.username,
      },
    });

    if (usedUsernameCount > 0) {
      isAccountUsed = true;

      errorMessage.username = "The username is already in use.";
    }

    if (isAccountUsed) {
      return createBadRequestError(event, {
        errorMessage,
      });
    }

    const hashedPassword: string = hashPassword(
      storeRegisterBodySPR.data.password,
    );

    const user: User = await event.context.prisma.user.create({
      data: {
        username: storeRegisterBodySPR.data.username,
        email: storeRegisterBodySPR.data.email,
        name: storeRegisterBodySPR.data.name,
        firstName: storeRegisterBodySPR.data.firstName,
        password: hashedPassword,
        role: userConfig.USER_ROLE_DEFAULT_VALUE,
      },
    });

    const token = createRandomString(authConfig.TOKEN_SIZE);
    const dayjs = useDayjs();
    const expiresAt: Date = dayjs()
      .add(authConfig.TOKEN_VALIDITY, "milliseconds")
      .toDate();

    await event.context.prisma.activationToken.create({
      data: {
        token,
        expiresAt,
        userId: user.id,
      },
    });

    sendActivationLink({
      activationLink: `${runtimeConfig.public.appUrl}/account/activate?t=${token}`,
      email: storeRegisterBodySPR.data.email,
      firstName: user.firstName,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        firstName: user.firstName,
        role: user.role,
        profileUrl: user.profileUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
    };
  },
);
