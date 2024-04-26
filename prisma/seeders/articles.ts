import { faker } from "@faker-js/faker";
import type { Prisma, PrismaClient, User } from "@prisma/client";

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

const createArticleTagsConnectData = (
  tags: Tag[],
): Prisma.TagUpdateManyWithoutArticlesNestedInput => {
  return {
    connect: faker.helpers
      .arrayElements(tags, {
        min: 0,
        max: articleConfig.TAGS_MAX_SIZE,
      })
      .map((tag: Tag) => ({
        id: tag.id,
      })),
  };
};

const connectArticlesToTags = (payload: {
  prisma: PrismaClient;
  articles: Article[];
  tags: Tag[];
}): Promise<Article[]> => {
  const { prisma, articles, tags } = payload;

  return Promise.all(
    articles.map((article: Article) =>
      prisma.article.update({
        data: {
          tags: createArticleTagsConnectData(tags),
        },
        where: {
          id: article.id,
        },
      }),
    ),
  );
};

const createArticle = (payload: {
  user: User;
}): Prisma.ArticleCreateManyInput => {
  const { user } = payload;

  const createdAt: Date = faker.date.future({
    years: 1,
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

  return {
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
  };
};

export const createArticles = async (payload: {
  prisma: PrismaClient;
  users: User[];
  tags: Tag[];
}): Promise<Article[]> => {
  const { prisma, users, tags } = payload;

  const data: Prisma.ArticleCreateManyInput[] = users.flatMap((user: User) =>
    faker.helpers.multiple(
      () =>
        createArticle({
          user,
        }),
      {
        count: {
          min: 0,
          max: 10,
        },
      },
    ),
  );

  await prisma.article.createMany({
    data,
  });

  const articles: Article[] = await prisma.article.findMany();

  return connectArticlesToTags({
    prisma,
    articles,
    tags,
  });
};
