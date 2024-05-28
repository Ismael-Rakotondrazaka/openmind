import { faker } from "@faker-js/faker";
import type { Prisma, ReactionType, User } from "@prisma/client";

const createType = (): ReactionType => {
  return faker.helpers.arrayElement<ReactionType>([
    "celebrate",
    "like",
    "love",
  ]);
};

export const createArticleReactionData = (payload: {
  users: User[];
  refDate: Date;
}): Prisma.ReactionCreateNestedManyWithoutArticleInput => {
  const { users, refDate } = payload;

  return {
    create: faker.helpers.arrayElements(users).map((user) => {
      const createdAt: Date = faker.date.soon({
        days: 60,
        refDate,
      });

      return {
        type: createType(),
        userId: user.id,
        createdAt,
      };
    }),
  };
};

export const createCommentReactionData = (payload: {
  users: User[];
  refDate: Date;
}): Prisma.ReactionCreateNestedManyWithoutCommentInput => {
  const { users, refDate } = payload;

  return {
    create: faker.helpers.arrayElements(users).map((user) => {
      const createdAt: Date = faker.date.soon({
        days: 60,
        refDate,
      });

      return {
        type: createType(),
        userId: user.id,
        createdAt,
      };
    }),
  };
};
