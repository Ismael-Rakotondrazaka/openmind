import type { Prisma, ReactionType, User } from '@prisma/client';

import { faker } from '@faker-js/faker';

const createType = (): ReactionType => {
  return faker.helpers.arrayElement<ReactionType>([
    'celebrate',
    'like',
    'love',
  ]);
};

export const createArticleReactionData = (payload: {
  refDate: Date;
  users: User[];
}): Prisma.ReactionCreateNestedManyWithoutArticleInput => {
  const { refDate, users } = payload;

  return {
    create: faker.helpers.arrayElements(users).map(user => {
      const createdAt: Date = faker.date.soon({
        days: 60,
        refDate,
      });

      return {
        createdAt,
        type: createType(),
        userId: user.id,
      };
    }),
  };
};

export const createCommentReactionData = (payload: {
  refDate: Date;
  users: User[];
}): Prisma.ReactionCreateNestedManyWithoutCommentInput => {
  const { refDate, users } = payload;

  return {
    create: faker.helpers.arrayElements(users).map(user => {
      const createdAt: Date = faker.date.soon({
        days: 60,
        refDate,
      });

      return {
        createdAt,
        type: createType(),
        userId: user.id,
      };
    }),
  };
};
