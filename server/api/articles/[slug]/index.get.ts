import type { SafeParseReturnType } from "zod";
import type { User } from "@prisma/client";
import {
  type ShowArticleData,
  type ShowArticleError,
  type ShowArticleParam,
  showArticleParamSchema,
  createNotFoundError,
  ShowArticleDataSchema,
  type Reaction,
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
      await event.context.prisma.article
        .findFirst({
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
            /* eslint-disable indent */
            savedArticles:
              authUser === null
                ? undefined
                : {
                    where: {
                      userId: authUser.id,
                    },
                  },
            views:
              authUser === null
                ? undefined
                : {
                    where: {
                      userId: authUser.id,
                    },
                  },
            reactions:
              authUser === null
                ? undefined
                : {
                    where: {
                      userId: authUser.id,
                    },
                  },
            /* eslint-enable indent */
            _count: {
              select: {
                comments: {
                  where: {
                    deletedAt: null,
                  },
                },
                reactions: true,
                tags: true,
                views: true,
              },
            },
          },
        })
        .then((article) => {
          if (article !== null) {
            const auth: StoreArticleData["article"]["auth"] = {
              savedArticle: null,
              view: null,
              reaction: null,
            };

            if (article.savedArticles.length > 0) {
              auth.savedArticle = article.savedArticles[0];
            }

            if (article.views.length > 0) {
              auth.view = article.views[0];
            }

            if (article.reactions.length > 0) {
              auth.reaction = article.reactions[0] as Reaction;
            }

            return {
              ...article,
              auth,
            };
          } else {
            return null;
          }
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
