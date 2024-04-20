import type { Comment, User, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { createHTML, createIdentifier } from "./commons";

const createContent = (): Comment["content"] => {
  return createHTML();
};

const createComment = (payload: {
  prisma: PrismaClient;
  article: Article;
  parent?: Comment;
  users: User[];
}): Promise<Comment> => {
  const { prisma, article, parent, users } = payload;

  const refDate: Date = parent?.createdAt ?? article.createdAt;

  const createdAt: Date = faker.date.soon({
    days: 15,
    refDate,
  });

  const updatedAt: Date =
    faker.helpers.maybe(
      () =>
        faker.date.soon({
          days: 10,
        }),
      {
        probability: 0.1,
      },
    ) ?? createdAt;

  const userId: number = faker.helpers.arrayElement<User>(users).id;

  return prisma.comment.create({
    data: {
      id: createIdentifier(),
      content: createContent(),
      parentId: parent?.id,
      userId,
      articleId: article.id,
      createdAt,
      updatedAt,
    },
  });
};

const createCommentsPerArticle = async (payload: {
  prisma: PrismaClient;
  article: Article;
  users: User[];
  parent?: Comment;
  depth?: number;
}): Promise<Comment[]> => {
  const { prisma, article, users, parent, depth = 0 } = payload;

  // we stop at level 1
  if (depth === 1) {
    const comments: Comment[] = await Promise.all(
      faker.helpers.multiple(
        () =>
          createComment({
            prisma,
            article,
            users,
            parent,
          }),
        {
          count: {
            min: 0,
            max: 7,
          },
        },
      ),
    );

    return comments;
  } else {
    const comments: Comment[] = await Promise.all(
      faker.helpers.multiple(
        () =>
          createComment({
            prisma,
            article,
            users,
            parent,
          }),
        {
          count: {
            min: 0,
            max: 7,
          },
        },
      ),
    );

    const replies: Comment[] = await Promise.all(
      comments.map((comment: Comment) =>
        createCommentsPerArticle({
          prisma,
          article,
          users,
          depth: depth + 1,
          parent: comment,
        }),
      ),
    ).then((nestedArr: Comment[][]): Comment[] =>
      nestedArr.flatMap((arr: Comment[]): Comment[] => arr),
    );

    return comments.concat(replies);
  }
};

export const createComments = async (payload: {
  prisma: PrismaClient;
  articles: Article[];
  users: User[];
}): Promise<Comment[]> => {
  const { prisma, articles, users } = payload;

  const nestedArr: Comment[][] = await Promise.all(
    articles.flatMap((article: Article) =>
      createCommentsPerArticle({
        article,
        prisma,
        users,
      }),
    ),
  );

  return nestedArr.flatMap((arr: Comment[]): Comment[] => arr);
};
