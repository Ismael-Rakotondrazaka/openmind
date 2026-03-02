import type { Article, Prisma, PrismaClient, Tag, User } from '@prisma/client';

import { faker } from '@faker-js/faker';
import slugify from 'slugify';

import { articleConfig } from '~/configs';

import { createCommentsData } from './comments';
import { createIdentifier } from './commons';
import { createArticleReactionData } from './reactions';
import { createSavedArticleData } from './savedArticles';
import { createViewData } from './views';

export type ArticleData = {
  content: string;
  coverUrl: string;
  summary: string;
  tags: string[];
  title: string;
};

const createId = (): Article['id'] => {
  return createIdentifier(articleConfig.ID_LENGTH);
};

const createSlug = (raw: string): Article['slug'] => {
  return slugify(raw, {
    lower: true,
    trim: true,
  });
};

const createTagValueIdMap = (tags: Tag[]): Map<string, number> => {
  const result: Map<string, number> = new Map();

  tags.forEach(tag => {
    result.set(tag.value, tag.id);
  });

  return result;
};

export const createArticleData = (payload: {
  data: ArticleData;
  tags: Tag[];
  user: User;
  users: User[];
}): Prisma.ArticleCreateInput => {
  const { data, tags, user, users } = payload;

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
      }
    ) ?? createdAt;

  const id: string = createId();
  const slug: string = createSlug(data.title);

  return {
    comments: createCommentsData({
      articleId: id,
      refDate: createdAt,
      users,
    }),
    content: data.content,
    coverUrl: data.coverUrl,
    createdAt,
    id,
    isVisible: true,
    reactions: createArticleReactionData({
      refDate: createdAt,
      users,
    }),
    savedArticles: createSavedArticleData({
      refDate: createdAt,
      users,
    }),
    slug,
    summary: data.summary,
    tags: {
      connect: data.tags.map(value => ({
        id: tagValueIdMap.get(value)!,
      })),
    },
    title: data.title,
    updatedAt,
    user: {
      connect: {
        id: user.id,
      },
    },
    views: createViewData({
      refDate: createdAt,
      users,
    }),
  };
};

export const createArticles = async (payload: {
  data: ArticleData[];
  prisma: PrismaClient;
  tags: Tag[];
  users: User[];
}): Promise<Article[]> => {
  const { data, prisma, tags, users } = payload;

  const articleCreateData: Prisma.ArticleCreateInput[] = data.map(dataValue =>
    createArticleData({
      data: dataValue,
      tags,
      user: faker.helpers.arrayElement(users),
      users,
    })
  );

  return Promise.all(
    articleCreateData.map(articleData =>
      prisma.article.create({
        data: articleData,
      })
    )
  );
};
