import { faker } from "@faker-js/faker";
import type {
  Article,
  Comment,
  Prisma,
  PrismaClient,
  Reaction,
  ReactionType,
  User,
} from "@prisma/client";

const createType = (): ReactionType => {
  return faker.helpers.arrayElement<ReactionType>([
    "celebrate",
    "like",
    "love",
  ]);
};

type ReactionModelObj =
  | {
      article: Article;
      comment: undefined;
    }
  | {
      article: undefined;
      comment: Comment;
    };

const createReactionData = (
  payload: {
    prisma: PrismaClient;
    user: User;
  } & ReactionModelObj,
): Prisma.ReactionCreateManyInput => {
  const { comment, article, user } = payload;

  let refDate: Date | undefined;
  if (payload.comment === undefined) {
    refDate = payload.article.createdAt;
  } else {
    refDate = payload.comment.createdAt;
  }

  const createdAt: Date = faker.date.soon({
    days: 60,
    refDate,
  });

  return {
    type: createType(),
    userId: user.id,
    articleId: article?.id ?? null,
    commentId: comment?.id ?? null,
    createdAt,
  };
};

const createReactionsDataPerModel = (
  payload: {
    prisma: PrismaClient;
    users: User[];
  } & ReactionModelObj,
): Prisma.ReactionCreateManyInput[] => {
  const { article, comment, prisma, users } = payload;

  const reactors: User[] = faker.helpers.arrayElements<User>(users);

  return reactors.map((reactor: User) =>
    createReactionData({
      prisma,
      user: reactor,
      ...({
        article,
        comment,
      } as ReactionModelObj),
    }),
  );
};

export const createReactions = async (payload: {
  prisma: PrismaClient;
  users: User[];
  articles: Article[];
  comments: Comment[];
}): Promise<Reaction[]> => {
  const { prisma, users, articles, comments } = payload;

  const articleReactionsData: Prisma.ReactionCreateManyInput[] =
    await Promise.all(
      articles.map((article: Article) =>
        createReactionsDataPerModel({
          article,
          comment: undefined,
          prisma,
          users,
        }),
      ),
    ).then(
      (
        nestedArr: Prisma.ReactionCreateManyInput[][],
      ): Prisma.ReactionCreateManyInput[] => nestedArr.flat(),
    );

  const commentReactionsData: Prisma.ReactionCreateManyInput[] =
    await Promise.all(
      comments.map((comment: Comment) =>
        createReactionsDataPerModel({
          article: undefined,
          comment,
          prisma,
          users,
        }),
      ),
    ).then(
      (
        nestedArr: Prisma.ReactionCreateManyInput[][],
      ): Prisma.ReactionCreateManyInput[] => nestedArr.flat(),
    );

  const data: Prisma.ReactionCreateManyInput[] =
    articleReactionsData.concat(commentReactionsData);

  await prisma.reaction.createMany({
    data,
  });

  return prisma.reaction.findMany();
};
