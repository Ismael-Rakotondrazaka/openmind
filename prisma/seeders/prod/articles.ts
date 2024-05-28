import { faker } from "@faker-js/faker";
import type { Article, Prisma, PrismaClient, Tag, User } from "@prisma/client";

import slugify from "slugify";
import { articleConfig } from "~/configs";
import { createCommentsData } from "./comments";
import { createIdentifier } from "./commons";
import { createArticleReactionData } from "./reactions";
import { createSavedArticleData } from "./savedArticles";
import { createViewData } from "./views";

export type ArticleData = {
  content: string;
  title: string;
  summary: string;
  coverUrl: string;
  tags: string[];
};

const createId = (): Article["id"] => {
  return createIdentifier(articleConfig.ID_LENGTH);
};

const createSlug = (raw: string): Article["slug"] => {
  return slugify(raw, {
    lower: true,
    trim: true,
  });
};

const createTagValueIdMap = (tags: Tag[]): Map<string, number> => {
  const result: Map<string, number> = new Map();

  tags.forEach((tag) => {
    result.set(tag.value, tag.id);
  });

  return result;
};

export const createArticleData = (payload: {
  user: User;
  users: User[];
  data: ArticleData;
  tags: Tag[];
}): Prisma.ArticleCreateInput => {
  const { user, users, data, tags } = payload;

  const tagValueIdMap = createTagValueIdMap(tags);

  const createdAt: Date = faker.date.soon({
    days: 60,
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

  const id: string = createId();
  const slug: string = createSlug(data.title);

  return {
    id,
    slug,
    title: data.title,
    coverUrl: data.coverUrl,
    content: data.content,
    summary: data.summary,
    isVisible: true,
    createdAt,
    updatedAt,
    user: {
      connect: {
        id: user.id,
      },
    },
    tags: {
      connect: data.tags.map((value) => ({
        id: tagValueIdMap.get(value)!,
      })),
    },
    views: createViewData({
      refDate: createdAt,
      users,
    }),
    savedArticles: createSavedArticleData({
      refDate: createdAt,
      users,
    }),
    reactions: createArticleReactionData({
      refDate: createdAt,
      users,
    }),
    comments: createCommentsData({
      users,
      refDate: createdAt,
      articleId: id,
    }),
  };
};

export const createArticles = async (payload: {
  prisma: PrismaClient;
  data: ArticleData[];
  users: User[];
  tags: Tag[];
}): Promise<Article[]> => {
  const { prisma, users, tags, data } = payload;

  const articleCreateData: Prisma.ArticleCreateInput[] = data.map((dataValue) =>
    createArticleData({
      users,
      data: dataValue,
      tags,
      user: faker.helpers.arrayElement(users),
    }),
  );

  return Promise.all(
    articleCreateData.map((articleData) =>
      prisma.article.create({
        data: articleData,
      }),
    ),
  );
};
