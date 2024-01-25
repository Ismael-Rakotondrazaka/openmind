import type { SafeParseReturnType } from "zod";
import type { Tag, User } from "@prisma/client";
import {
  type IndexRecommendedArticleData,
  type IndexRecommendedArticleError,
  type IndexRecommendedArticleQuery,
  IndexRecommendedArticleQuerySchema,
  createBadRequestError,
  getRequestErrorMessage,
  IndexRecommendedArticleDataSchema,
  createUnauthorizedError,
  type Reaction,
} from "~/utils";
import { safeParseRequestQueryAs } from "~/server/utils";

export default defineEventHandler(
  async (
    event,
  ): Promise<IndexRecommendedArticleData | IndexRecommendedArticleError> => {
    const authUser: User | null = await getAuthUser(event);

    if (authUser === null) {
      return createUnauthorizedError(event);
    }

    const indexRecommendedArticleQuerySPR: SafeParseReturnType<
      IndexRecommendedArticleQuery,
      IndexRecommendedArticleQuery
    > = await safeParseRequestQueryAs(
      event,
      IndexRecommendedArticleQuerySchema,
    );

    if (!indexRecommendedArticleQuerySPR.success) {
      return createBadRequestError(event, {
        errorMessage: getRequestErrorMessage(indexRecommendedArticleQuerySPR),
      });
    }

    const tagPreferenceIds: number[] = await event.context.prisma.tag
      .findMany({
        where: {
          users: {
            some: {
              id: authUser.id,
            },
          },
        },
        select: {
          id: true,
        },
      })
      .then(
        (
          tags: {
            id: Tag["id"];
          }[],
        ) => tags.map((tag: { id: Tag["id"] }) => tag.id),
      );

    const savedArticleTagIds: number[] = await event.context.prisma.savedArticle
      .findMany({
        where: {
          userId: authUser.id,
        },
        select: {
          article: {
            select: {
              tags: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      })
      .then(
        (
          values: {
            article: {
              tags: {
                id: number;
              }[];
            };
          }[],
        ) =>
          values.flatMap(
            (value: {
              article: {
                tags: {
                  id: number;
                }[];
              };
            }) => value.article.tags.map((tag: { id: Tag["id"] }) => tag.id),
          ),
      );

    const recommendedTagIds: number[] = Array.from(
      new Set(tagPreferenceIds.concat(...savedArticleTagIds)),
    ).sort((a: number, b: number) => a - b);

    const totalCounts: number = await event.context.prisma.article.count({
      where: {
        tags: {
          some: {
            id: {
              in: recommendedTagIds,
            },
          },
        },
        deletedAt: null,
        isVisible: true,
      },
      orderBy: indexRecommendedArticleQuerySPR.data.orderBy,
    });

    const pageSize: number = indexRecommendedArticleQuerySPR.data.pageSize;

    const totalPages: number = Math.ceil(
      totalCounts / indexRecommendedArticleQuerySPR.data.pageSize,
    );

    const currentPage: number = indexRecommendedArticleQuerySPR.data.page;

    const links: PaginationLinks = makePaginationLinks(
      event,
      currentPage,
      totalPages,
      pageSize,
    );

    const articles = await event.context.prisma.article
      .findMany({
        where: {
          tags: {
            some: {
              id: {
                in: recommendedTagIds,
              },
            },
          },
          deletedAt: null,
          isVisible: true,
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
        orderBy: indexRecommendedArticleQuerySPR.data.orderBy,
        take: pageSize,
        skip: calculatePaginationSkip(currentPage, pageSize),
      })
      .then((articles) => {
        if (authUser !== null) {
          return articles.map((article) => {
            const auth: IndexArticleData["articles"][0]["auth"] = {
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
          });
        } else {
          return articles.map((article) => ({
            ...article,
            auth: null,
          }));
        }
      });

    return IndexRecommendedArticleDataSchema.parse({
      articles,
      count: articles.length,
      totalCounts,
      page: currentPage,
      pageSize,
      totalPages,
      links,
    });
  },
);
