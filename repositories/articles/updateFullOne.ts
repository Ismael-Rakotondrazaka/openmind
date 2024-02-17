import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { ArticleFullSchema, type ArticleFull } from "~/utils";

export const updateFullOne = ({
  authUser,
  data,
  where,
}: {
  authUser: User | null;
  data:
    | (Prisma.Without<
        Prisma.ArticleUpdateInput,
        Prisma.ArticleUncheckedUpdateInput
      > &
        Prisma.ArticleUncheckedUpdateInput)
    | (Prisma.Without<
        Prisma.ArticleUncheckedUpdateInput,
        Prisma.ArticleUpdateInput
      > &
        Prisma.ArticleUpdateInput);
  where: Prisma.ArticleUpdateArgs["where"];
}): Promise<ArticleFull> => {
  return prisma.article
    .update({
      where,
      data,
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
      const auth: ArticleFull["_auth"] = {
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

      const parsedArticle: ArticleFull = ArticleFullSchema.parse({
        ...article,
        auth,
      });

      return parsedArticle;
    });
};
