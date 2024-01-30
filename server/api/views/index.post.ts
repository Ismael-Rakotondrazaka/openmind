import type { Article, User } from "@prisma/client";
import { articleRepository } from "~/repositories";
import {
  type StoreViewData,
  type StoreViewError,
  createBadRequestError,
  createUnauthorizedError,
  getRequestErrorMessage,
  StoreViewBodySchema,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<StoreViewData | StoreViewError> => {
    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    const storeViewBodySPR = await safeParseRequestBodyAs(
      event,
      StoreViewBodySchema,
    );

    if (!storeViewBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(storeViewBodySPR),
      });
    }

    const article: Article | null = await articleRepository.findOne({
      where: {
        id: storeViewBodySPR.data.articleId,
        deletedAt: null,
        isVisible: true,
      },
    });
    if (article === null) {
      return createBadRequestError(event, {
        errorMessage: {
          articleId: "The article does not exist.",
        },
      });
    }

    const isAlreadyViewed: boolean = await event.context.prisma.view
      .count({
        where: {
          articleId: storeViewBodySPR.data.articleId,
          userId: authUser.id,
        },
      })
      .then((count: number) => count > 0);
    if (isAlreadyViewed) {
      return createBadRequestError(event, {
        errorMessage: {
          articleId: "The article is already viewed.",
        },
      });
    }

    const now = new Date();

    const view: StoreViewData["view"] = await event.context.prisma.view.create({
      data: {
        articleId: storeViewBodySPR.data.articleId,
        userId: authUser.id,
        createdAt: now,
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
      view,
    };
  },
);
