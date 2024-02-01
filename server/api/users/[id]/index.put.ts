import type { SafeParseReturnType } from "zod";
import type { User } from "@prisma/client";
import {
  type UpdateUserData,
  type UpdateUserError,
  type UpdateUserParam,
  createBadRequestError,
  createUnauthorizedError,
  createNotFoundError,
  createForbiddenError,
  getRequestErrorMessage,
  UpdateUserParamSchema,
  UpdateUserDataSchema,
} from "~/utils";
import { UpdateUserBodySchema } from "~/server/utils";
import { userRepository } from "~/repositories";

export default defineEventHandler(
  async (event): Promise<UpdateUserData | UpdateUserError> => {
    const updateArticleParamSPR: SafeParseReturnType<
      UpdateUserParam,
      UpdateUserParam
    > = await safeParseRequestParamAs(event, UpdateUserParamSchema);

    if (!updateArticleParamSPR.success) {
      return createNotFoundError(event);
    }

    const user: User | null = await userRepository.findOne({
      where: {
        id: updateArticleParamSPR.data.id,
      },
    });

    if (user === null) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    if (authUser.id !== user.id) {
      return createForbiddenError(event);
    }

    const updateArticleBodySPR = await safeParseRequestBodyAs(
      event,
      UpdateUserBodySchema,
    );

    if (!updateArticleBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(updateArticleBodySPR),
      });
    }

    // Check if one change is made
    if (
      !(
        (updateArticleBodySPR.data.name !== undefined &&
          updateArticleBodySPR.data.name !== user.name) ||
        (updateArticleBodySPR.data.firstName !== undefined &&
          updateArticleBodySPR.data.firstName !== user.firstName) ||
        (updateArticleBodySPR.data.profile !== undefined &&
          updateArticleBodySPR.data.profile !== user.profileUrl)
      )
    ) {
      return createBadRequestError(event, {
        message: "At least one change is required.",
        errorMessage: {},
      });
    }

    let newName: string | undefined;
    if (
      updateArticleBodySPR.data.name !== undefined &&
      updateArticleBodySPR.data.name !== user.name
    ) {
      newName = sanitize(updateArticleBodySPR.data.name);
    }

    let newFirstName: string | undefined;
    if (
      updateArticleBodySPR.data.firstName !== undefined &&
      updateArticleBodySPR.data.firstName !== user.firstName
    ) {
      newFirstName = sanitize(updateArticleBodySPR.data.firstName);
    }

    const now: Date = new Date();

    let newProfileUrl: string | null | undefined;
    if (updateArticleBodySPR.data.profile === null) {
      newProfileUrl = null;
      deleteFilesInFolder({
        folderPath: `public/users/${user.id}/profile`,
      });
    } else if (updateArticleBodySPR.data.profile !== undefined) {
      newProfileUrl = saveUserProfile({
        file: updateArticleBodySPR.data.profile,
        userId: user.id,
      });
    }

    const updatedUser: UpdateUserData["user"] =
      await userRepository.updateFullOne({
        where: {
          id: user.id,
        },
        data: {
          name: newName,
          firstName: newFirstName,
          profileUrl: newProfileUrl,
          updatedAt: now,
        },
        authUser,
      });

    return UpdateUserDataSchema.parse({
      user: updatedUser,
    });
  },
);
