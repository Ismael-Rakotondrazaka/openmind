import { faker } from "@faker-js/faker";
import type { Prisma, User } from "@prisma/client";
import { createIdentifier } from "./commons";
import { commentsData, repliesData } from "./data";
import { createCommentReactionData } from "./reactions";

export const createCommentsData = (payload: {
  users: User[];
  refDate: Date;
  articleId: string;
}): Prisma.CommentCreateNestedManyWithoutArticleInput => {
  const { users, refDate, articleId } = payload;

  return {
    create: faker.helpers
      .arrayElements(users, {
        min: 0,
        max: 3,
      })
      .map((user): Prisma.CommentUncheckedCreateWithoutArticleInput => {
        const createdAt: Date = faker.date.soon({
          refDate,
          days: 60,
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
          id,
          userId: user.id,
          content: faker.helpers.arrayElement(commentsData),
          createdAt,
          updatedAt,
          replies: createReplies({
            users,
            refDate: createdAt,
            articleId,
          }),
          reactions: createCommentReactionData({
            users,
            refDate: createdAt,
          }),
        };
      }),
  };
};

const createReplies = (payload: {
  users: User[];
  refDate: Date;
  articleId: string;
}): Prisma.CommentUncheckedCreateNestedManyWithoutParentInput => {
  const { users, refDate, articleId } = payload;

  return {
    create: faker.helpers
      .arrayElements(users, {
        min: 0,
        max: 2,
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
          id: createIdentifier(),
          articleId,
          content: faker.helpers.arrayElement(repliesData),
          userId: user.id,
          createdAt,
          updatedAt,
          reactions: createCommentReactionData({
            users,
            refDate,
          }),
        };
      }),
  };
};
