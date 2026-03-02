import type { Prisma, User } from '@prisma/client';

import { faker } from '@faker-js/faker';

export const createViewData = (payload: {
  refDate: Date;
  users: User[];
}): Prisma.ViewCreateNestedManyWithoutArticleInput => {
  const { refDate, users } = payload;

  return {
    create: faker.helpers.arrayElements(users).map(user => {
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
        createdAt,
        updatedAt,
        userId: user.id,
      };
    }),
  };
};
