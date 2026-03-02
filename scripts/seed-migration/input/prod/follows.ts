import type { Prisma, PrismaClient, User } from '@prisma/client';

import { faker } from '@faker-js/faker';

const createFollowData = (payload: {
  follower: User;
  following: User;
}): Prisma.FollowCreateManyInput => {
  const { follower, following } = payload;

  const refDate: Date = new Date(
    Math.max(follower.createdAt.getTime(), following.createdAt.getTime())
  );

  const createdAt: Date = faker.date.future({
    refDate,
    years: 1,
  });

  return {
    createdAt,
    followerId: follower.id,
    followingId: following.id,
  };
};

const createPossibleFollowersForEachUsers = (users: User[]): User[][] => {
  const left: User[][] = Array.from({
    length: users.length,
  }).map(() => []);
  const right: User[][] = Array.from({
    length: users.length,
  }).map(() => []);

  users.forEach((_user: User, i: number) => {
    if (i !== 0) {
      left[i] = left[i - 1].concat(users[i - 1]);
    }

    const j: number = users.length - 1 - i;
    if (j !== users.length - 1) {
      right[j] = right[j + 1].concat(users[j + 1]);
    }
  });

  const result: User[][] = [];
  for (let i = 0; i < users.length; i++) {
    result.push(left[i].concat(right[i]));
  }

  return result;
};

const createFollowsDataPerUser = (payload: {
  user: User;
  users: User[];
}): Prisma.FollowCreateManyInput[] => {
  const { user, users } = payload;

  return faker.helpers.arrayElements(users).map((follower: User) =>
    createFollowData({
      follower,
      following: user,
    })
  );
};

export const createFollows = async (payload: {
  prisma: PrismaClient;
  users: User[];
}) => {
  const { prisma, users } = payload;

  const possibleFollowers: User[][] =
    createPossibleFollowersForEachUsers(users);

  const data: Prisma.FollowCreateManyInput[] = users.flatMap(
    (user: User, i: number) => {
      return createFollowsDataPerUser({
        user,
        users: possibleFollowers[i],
      });
    }
  );

  await prisma.follow.createMany({
    data,
  });
};
