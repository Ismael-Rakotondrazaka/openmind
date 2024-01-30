import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { ArticleFullSchema, type ArticleFull } from "~/utils";

export const findFullMany = ({
  authUser,
  where,
  orderBy,
  skip,
  take,
}: {
  authUser: User | null;
  where?: Prisma.ArticleWhereInput;
  orderBy?: Prisma.ArticleOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<ArticleFull[]> => {
  return prisma.article
    .findMany({
      where: {
        ...where,
        deletedAt:
          authUser !== null &&
          (authUser.role !== "user" || where?.userId === authUser.id)
            ? where?.deletedAt
            : null,
        isVisible:
          authUser !== null &&
          (authUser.role !== "user" || where?.userId === authUser.id)
            ? where?.isVisible
            : true,
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
      orderBy,
      take,
      skip,
    })
    .then((articles): ArticleFull[] => {
      if (authUser !== null) {
        return articles.map((article): ArticleFull => {
          const auth: ArticleFull["auth"] = {
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

          // parse to strip excess properties
          const parsedArticle: ArticleFull = ArticleFullSchema.parse({
            ...article,
            auth,
          });

          return parsedArticle;
        });
      } else {
        return articles.map((article): ArticleFull => {
          const parsedArticle: ArticleFull = ArticleFullSchema.parse({
            ...article,
            auth: null,
          });

          return parsedArticle;
        });
      }
    });
};
