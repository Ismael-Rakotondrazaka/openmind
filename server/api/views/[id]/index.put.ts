import type { User, View } from "@prisma/client";
import { viewRepository } from "~/repositories";
import {
  type UpdateViewData,
  type UpdateViewError,
  createUnauthorizedError,
  createNotFoundError,
  createForbiddenError,
  UpdateViewParamSchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<UpdateViewData | UpdateViewError> => {
    const updateArticleParamSPR = await safeParseRequestParamAs(
      event,
      UpdateViewParamSchema,
    );

    if (!updateArticleParamSPR.success) {
      return createNotFoundError(event);
    }

    const view: View | null = await viewRepository.findOne({
      where: {
        id: updateArticleParamSPR.data.id,
      },
    });

    if (view === null) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    if (authUser.id !== view.userId) {
      return createForbiddenError(event);
    }

    const now: Date = new Date();

    const updatedView: UpdateViewData["view"] =
      await viewRepository.updateFullOne({
        where: {
          id: view.id,
        },
        data: {
          updatedAt: now,
        },
      });

    return {
      view: updatedView,
    };
  },
);
