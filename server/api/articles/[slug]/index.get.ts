import type { SafeParseReturnType } from "zod";
import type { User } from "@prisma/client";
import {
  type ShowArticleData,
  type ShowArticleError,
  type ShowArticleParam,
  showArticleParamSchema,
  createNotFoundError,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<ShowArticleData | ShowArticleError> => {
    const showArticleParamSPR: SafeParseReturnType<
      ShowArticleParam,
      ShowArticleParam
    > = await safeParseRequestParamAs(event, showArticleParamSchema);

    if (!showArticleParamSPR.success) {
      return createNotFoundError(event);
    }

    const authUser: User | null = await getAuthUser(event);

    const article: ShowArticleData["article"] | null =
      await event.context.prisma.article.findFirst({
        where: {
          slug: showArticleParamSPR.data.slug,
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
          tags: true,
        },
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

    return {
      article,
    };
  },
);
