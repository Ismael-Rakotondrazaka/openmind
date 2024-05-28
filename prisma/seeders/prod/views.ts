import { faker } from "@faker-js/faker";
import type { Prisma, User } from "@prisma/client";

export const createViewData = (payload: {
  users: User[];
  refDate: Date;
}): Prisma.ViewCreateNestedManyWithoutArticleInput => {
  const { users, refDate } = payload;

  return {
    create: faker.helpers.arrayElements(users).map((user) => {
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
        userId: user.id,
        createdAt,
        updatedAt,
      };
    }),
  };
};
