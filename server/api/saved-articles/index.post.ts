import type { Article, SavedArticle, User } from "@prisma/client";
import { articleRepository } from "~/repositories";
import {
  type StoreSavedArticleData,
  type StoreSavedArticleError,
  createBadRequestError,
  createUnauthorizedError,
  getRequestErrorMessage,
  StoreSavedArticleBodySchema,
  StoreSavedArticleDataSchema,
  type Reaction,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<StoreSavedArticleData | StoreSavedArticleError> => {
    const authUser: User | null = await getAuthUser(event);
    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    const storeSavedArticleBodySPR = await safeParseRequestBodyAs(
      event,
      StoreSavedArticleBodySchema,
    );

    if (!storeSavedArticleBodySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(storeSavedArticleBodySPR),
      });
    }

    const article: Article | null = await articleRepository.findOne({
      where: {
        id: storeSavedArticleBodySPR.data.articleId,
        isVisible: true,
        deletedAt: null,
      },
    });

    if (article === null) {
      return createBadRequestError(event, {
        errorMessage: {
          articleId: "The article does not exists.",
        },
      });
    }

    const isAlreadySaved: boolean = await event.context.prisma.savedArticle
      .findFirst({
        where: {
          userId: authUser.id,
          articleId: storeSavedArticleBodySPR.data.articleId,
        },
      })
      .then((val: SavedArticle | null) => val !== null);

    if (isAlreadySaved) {
      return createBadRequestError(event, {
        errorMessage: {
          articleId: "The article is already saved.",
        },
      });
    }

    const savedArticle: StoreSavedArticleData["savedArticle"] =
      await event.context.prisma.savedArticle
        .create({
          data: {
            articleId: storeSavedArticleBodySPR.data.articleId,
            userId: authUser.id,
          },
          include: {
            article: {
              include: {
                tags: true,
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
                savedArticles: {
                  where: {
                    userId: authUser.id,
                  },
                },
                views: {
                  where: {
                    userId: authUser.id,
                  },
                },
                reactions: {
                  where: {
                    userId: authUser.id,
                  },
                },
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
            },
          },
        })
        .then((savedArticle) => {
          const auth: StoreArticleData["article"]["auth"] = {
            savedArticle: null,
            view: null,
            reaction: null,
          };

          if (savedArticle.article.savedArticles.length > 0) {
            auth.savedArticle = savedArticle.article.savedArticles[0];
          }

          if (savedArticle.article.views.length > 0) {
            auth.view = savedArticle.article.views[0];
          }

          if (savedArticle.article.reactions.length > 0) {
            auth.reaction = savedArticle.article.reactions[0] as Reaction;
          }

          return {
            ...savedArticle,
            article: {
              ...savedArticle.article,
              auth,
            },
          };
        });

    return StoreSavedArticleDataSchema.parse({
      savedArticle,
    });
  },
);
