import type { Prisma, User } from '@prisma/client';

import { faker } from '@faker-js/faker';

export const createSavedArticleData = (payload: {
  refDate: Date;
  users: User[];
}): Prisma.SavedArticleCreateNestedManyWithoutArticleInput => {
  const { refDate, users } = payload;

  return {
    create: faker.helpers.arrayElements(users).map(user => {
      const createdAt: Date = faker.date.soon({
        days: 60,
        refDate,
      });

      return {
        createdAt,
        userId: user.id,
      };
    }),
  };
};
