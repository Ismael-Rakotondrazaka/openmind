import { faker } from "@faker-js/faker";
import { PrismaClient, type User } from "@prisma/client";
import slugify from "slugify";
import { createHTML, createIdentifier, createIllustrationUrl } from "./commons";
import { articleConfig } from "~/configs";

const createId = (): Article["id"] => {
  return createIdentifier(articleConfig.ID_LENGTH);
};

const createTitle = (): Article["title"] => {
  return faker.lorem.sentence({
    min: 3,
    max: 7,
  });
};

const createSlug = (raw: string): Article["slug"] => {
  return slugify(raw, {
    lower: true,
    trim: true,
  });
};

const createSummary = (): Article["summary"] => {
  return (
    faker.helpers.maybe(() => {
      return faker.lorem.sentences({
        min: 1,
        max: 3,
      });
    }) ?? null
  );
};

const createCoverUrl = (): Article["coverUrl"] => {
  return (
    faker.helpers.maybe(() => {
      return createIllustrationUrl();
    }) ?? null
  );
};

const createIsVisible = (): Article["isVisible"] => {
  return (
    faker.helpers.maybe(() => true, {
      probability: 0.9,
    }) ?? false
  );
};

const createContent = (): Article["content"] => {
  return createHTML();
};

const createArticle = (payload: {
  prisma: PrismaClient;
  user: User;
}): Promise<Article> => {
  const { prisma, user } = payload;

  const createdAt: Date = faker.date.future({
    years: 2,
    refDate: user.createdAt,
  });

  const updatedAt: Date =
    faker.helpers.maybe(
      () => {
        return faker.date.soon({
          days: 30,
          refDate: createdAt,
        });
      },
      {
        probability: 0.1,
      },
    ) ?? createdAt;

  const title: string = createTitle();

  const slug: string = createSlug(title);

  return prisma.article.create({
    data: {
      id: createId(),
      slug,
      title,
      coverUrl: createCoverUrl(),
      content: createContent(),
      summary: createSummary(),
      isVisible: createIsVisible(),
      userId: user.id,
      createdAt,
      updatedAt,
    },
  });
};

export const createArticles = (payload: {
  prisma: PrismaClient;
  users: User[];
}): Promise<Article[]> => {
  const { prisma, users } = payload;

  return Promise.all(
    users.flatMap((user: User) =>
      faker.helpers.multiple(
        () =>
          createArticle({
            prisma,
            user,
          }),
        {
          count: {
            min: 0,
            max: 10,
          },
        },
      ),
    ),
  );
};
