import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import {
  SavedArticleFullSchema,
  type SavedArticleFull,
  type Reaction,
} from "~/utils";

export const findFullMany = ({
  authUser,
  where,
  orderBy,
  skip,
  take,
}: {
  authUser: User;
  where?: Prisma.SavedArticleWhereInput;
  orderBy?: Prisma.SavedArticleOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<SavedArticleFull[]> => {
  return prisma.savedArticle
    .findMany({
      where,
      include: {
        article: {
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
      orderBy,
      take,
      skip,
    })
    .then((savedArticles): SavedArticleFull[] => {
      return savedArticles.map((savedArticle): SavedArticleFull => {
        const auth: SavedArticleFull["article"]["_auth"] = {
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

        const savedArticleParsed: SavedArticleFull =
          SavedArticleFullSchema.parse({
            ...savedArticle,
            article: {
              ...savedArticle.article,
              auth,
            },
          });

        return savedArticleParsed;
      });
    });
};
