import type { Prisma, User } from '@prisma/client';

import { faker } from '@faker-js/faker';

import { createIdentifier } from './commons';
import { commentsData, repliesData } from './data';
import { createCommentReactionData } from './reactions';

export const createCommentsData = (payload: {
  articleId: string;
  refDate: Date;
  users: User[];
}): Prisma.CommentCreateNestedManyWithoutArticleInput => {
  const { articleId, refDate, users } = payload;

  return {
    create: faker.helpers
      .arrayElements(users, {
        max: 3,
        min: 0,
      })
      .map((user): Prisma.CommentUncheckedCreateWithoutArticleInput => {
        const createdAt: Date = faker.date.soon({
          days: 60,
          refDate,
        });

        const updatedAt: Date =
          faker.helpers.maybe(() => {
            return faker.date.soon({
              days: 30,
              refDate: createdAt,
            });
          }) ?? createdAt;

        const id: string = createIdentifier();

        return {
          content: faker.helpers.arrayElement(commentsData),
          createdAt,
          id,
          reactions: createCommentReactionData({
            refDate: createdAt,
            users,
          }),
          replies: createReplies({
            articleId,
            refDate: createdAt,
            users,
          }),
          updatedAt,
          userId: user.id,
        };
      }),
  };
};

const createReplies = (payload: {
  articleId: string;
  refDate: Date;
  users: User[];
}): Prisma.CommentUncheckedCreateNestedManyWithoutParentInput => {
  const { articleId, refDate, users } = payload;

  return {
    create: faker.helpers
      .arrayElements(users, {
        max: 2,
        min: 0,
      })
      .map((user): Prisma.CommentUncheckedCreateWithoutParentInput => {
        const createdAt: Date = faker.date.soon({
          days: 60,
          refDate,
        });

        const updatedAt: Date =
          faker.helpers.maybe(() => {
            return faker.date.soon({
              days: 30,
              refDate: createdAt,
            });
          }) ?? createdAt;

        return {
          articleId,
          content: faker.helpers.arrayElement(repliesData),
          createdAt,
          id: createIdentifier(),
          reactions: createCommentReactionData({
            refDate,
            users,
          }),
          updatedAt,
          userId: user.id,
        };
      }),
  };
};
