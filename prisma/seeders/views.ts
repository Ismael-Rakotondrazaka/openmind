import { faker } from "@faker-js/faker";
import { type PrismaClient, type Article } from "@prisma/client";

const createView = (payload: {
  prisma: PrismaClient;
  article: Article;
  user: User;
}): Promise<View> => {
  const { prisma, article, user } = payload;

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

  return prisma.view.create({
    data: {
      articleId: article.id,
      createdAt,
      updatedAt,
      userId: user.id,
    },
  });
};

export const createViews = (payload: {
  prisma: PrismaClient;
  articles: Article[];
  users: User[];
}): Promise<View[]> => {
  const { prisma, articles, users } = payload;

  return Promise.all(
    articles.flatMap((article: Article) => {
      const viewers: User[] = faker.helpers.arrayElements(users);

      return viewers.map((viewer: User) =>
        createView({
          prisma,
          article,
          user: viewer,
        }),
      );
    }),
  );
};
