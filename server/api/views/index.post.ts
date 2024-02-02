import type { Article, User } from "@prisma/client";
import { articleRepository, viewRepository } from "~/repositories";
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

    const isAlreadyViewed: boolean = await viewRepository.exist({
      where: {
        articleId: storeViewBodySPR.data.articleId,
        userId: authUser.id,
      },
    });
    if (isAlreadyViewed) {
      return createBadRequestError(event, {
        errorMessage: {
          articleId: "The article is already viewed.",
        },
      });
    }

    const now = new Date();

    const view: StoreViewData["view"] = await viewRepository.createFullOne({
      data: {
        articleId: storeViewBodySPR.data.articleId,
        userId: authUser.id,
        createdAt: now,
        updatedAt: now,
      },
    });

    return {
      view,
    };
  },
);
