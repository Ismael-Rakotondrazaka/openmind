import type { User } from "@prisma/client";
import {
  type ShowArticleData,
  type ShowArticleError,
  ShowArticleParamSchema,
  createNotFoundError,
  ShowArticleDataSchema,
} from "~/utils";
import { articleRepository } from "~/repositories";

export default defineEventHandler(
  async (event): Promise<ShowArticleData | ShowArticleError> => {
    const showArticleParamSPR = await safeParseRequestParamAs(
      event,
      ShowArticleParamSchema,
    );

    if (!showArticleParamSPR.success) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);

    const article: ShowArticleData["article"] | null =
      await articleRepository.findFullOne({
        where: {
          slug: showArticleParamSPR.data.slug,
        },
        authUser,
      });

    if (
      article === null ||
      (authUser === null &&
        (article.deletedAt !== null || article.isVisible === false)) ||
      (authUser !== null &&
        article.userId !== authUser.id &&
        authUser.role === "user")
    ) {
      return createNotFoundError(event);
    }

    return ShowArticleDataSchema.parse({
      article,
    });
  },
);
