import type { User } from "@prisma/client";
import { userRepository } from "~/repositories";
import {
  type ShowUserData,
  type ShowUserError,
  ShowUserParamSchema,
  createNotFoundError,
  ShowUserDataSchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<ShowUserData | ShowUserError> => {
    const showUserParamSPR = await safeParseRequestParamAs(
      event,
      ShowUserParamSchema,
    );

    if (!showUserParamSPR.success) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);

    const user: ShowUserData["user"] | null = await userRepository.findFullOne({
      where: {
        id: showUserParamSPR.data.id,
        emailVerifiedAt: {
          not: null,
        },
      },
      authUser,
    });

    if (user === null || (authUser === null && user.deletedAt !== null)) {
      return createNotFoundError(event);
    }

    return ShowUserDataSchema.parse({
      user,
    });
  },
);
