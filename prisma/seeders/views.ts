import { faker } from "@faker-js/faker";
import type { Prisma, PrismaClient, Article, View, User } from "@prisma/client";

const createViewData = (payload: {
  article: Article;
  user: User;
}): Prisma.ViewCreateManyInput => {
  const { article, user } = payload;

  const createdAt: Date = faker.date.future({
    refDate: article.createdAt,
  });
  const updatedAt: Date =
    faker.helpers.maybe(() => {
      return faker.date.soon({
        days: 60,
        refDate: createdAt,
      });
    }) ?? createdAt;

  return {
    createdAt,
    updatedAt,
    articleId: article.id,
    userId: user.id,
  };
};

export const createViews = async (payload: {
  prisma: PrismaClient;
  articles: Article[];
  users: User[];
}): Promise<View[]> => {
  const { prisma, articles, users } = payload;

  const data: Prisma.ViewCreateManyInput[] = articles.flatMap(
    (article: Article) => {
      const viewers: User[] = faker.helpers.arrayElements(users);

      return viewers.map((viewer: User) =>
        createViewData({
          article,
          user: viewer,
        }),
      );
    },
  );

  await prisma.view.createMany({
    data,
  });

  return prisma.view.findMany();
};
