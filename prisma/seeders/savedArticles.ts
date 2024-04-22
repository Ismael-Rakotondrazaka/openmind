import { faker } from "@faker-js/faker";
import type { Prisma, PrismaClient } from "@prisma/client";

const createSavedArticleData = (payload: {
  user: User;
  article: Article;
}): Prisma.SavedArticleCreateManyInput => {
  const { user, article } = payload;

  const createdAt: Date = faker.date.future({
    refDate: article.createdAt,
  });

  return {
    articleId: article.id,
    userId: user.id,
    createdAt,
  };
};

const createSavedArticlesDataPerUser = (payload: {
  user: User;
  articles: Article[];
}): Prisma.SavedArticleCreateManyInput[] => {
  const { user, articles } = payload;

  return faker.helpers.arrayElements(articles).map((article: Article) =>
    createSavedArticleData({
      article,
      user,
    }),
  );
};

export const createSavedArticles = async (payload: {
  prisma: PrismaClient;
  users: User[];
  articles: Article[];
}): Promise<SavedArticle[]> => {
  const { users, articles, prisma } = payload;

  const data: Prisma.SavedArticleCreateManyInput[] = users.flatMap(
    (user: User) =>
      createSavedArticlesDataPerUser({
        articles,
        user,
      }),
  );

  await prisma.savedArticle.createMany({
    data,
  });

  return prisma.savedArticle.findMany();
};
