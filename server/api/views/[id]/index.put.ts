import type { User, View } from "@prisma/client";
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

    const view: View | null = await event.context.prisma.view.findFirst({
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
      await event.context.prisma.view.update({
        where: {
          id: view.id,
        },
        data: {
          updatedAt: now,
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

    return {
      view: updatedView,
    };
  },
);
