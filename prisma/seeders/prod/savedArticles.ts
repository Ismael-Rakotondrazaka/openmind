import { faker } from "@faker-js/faker";
import type { Prisma, User } from "@prisma/client";

export const createSavedArticleData = (payload: {
  users: User[];
  refDate: Date;
}): Prisma.SavedArticleCreateNestedManyWithoutArticleInput => {
  const { users, refDate } = payload;

  return {
    create: faker.helpers.arrayElements(users).map((user) => {
      const createdAt: Date = faker.date.soon({
        days: 60,
        refDate,
      });

      return {
        userId: user.id,
        createdAt,
      };
    }),
  };
};
