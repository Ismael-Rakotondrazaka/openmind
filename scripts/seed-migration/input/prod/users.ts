import type { Prisma, PrismaClient, Role, Tag, User } from '@prisma/client';

import { faker } from '@faker-js/faker';
import { hashSync } from 'bcrypt';

import { articleConfig } from '~/configs';

export const hashPassword = (): string => {
  const passwordSaltRounds: number = 10;

  return hashSync('password', passwordSaltRounds);
};

type Gender = 'FEMALE' | 'MALE';

const createGender = (): Gender => {
  return faker.helpers.arrayElement<Gender>(['FEMALE', 'MALE']);
};

const createFirstName = (gender: Gender): string => {
  const mappedGender: Record<Gender, 'female' | 'male'> = {
    FEMALE: 'female',
    MALE: 'male',
  };

  return faker.person.firstName(mappedGender[gender]);
};

const createName = (gender: Gender): string => {
  const mappedGender: Record<Gender, 'female' | 'male'> = {
    FEMALE: 'female',
    MALE: 'male',
  };

  return faker.person.lastName(mappedGender[gender]);
};

const createUsername = (firstName: string, name: string): string => {
  return faker.internet
    .userName({
      firstName,
      lastName: name,
    })
    .toLowerCase();
};

const createRole = (): Role => {
  // TODO see more about roles
  // return faker.helpers.arrayElement<Role>(["user", "admin", "modo"]);
  return 'user';
};

const createUsersData = (payload: {
  prisma: PrismaClient;
  tags: Tag[];
  years?: number;
}): Prisma.UserCreateInput => {
  const { tags, years } = payload;

  const gender: Gender = createGender();
  const firstName: string = createFirstName(gender);
  const name: string = createName(gender);
  const createdAt: Date = faker.date.past({
    years,
  });

  return {
    createdAt,
    email: faker.internet
      .email({
        firstName,
        lastName: name,
      })
      .toLowerCase(),
    emailVerifiedAt: createdAt,
    firstName,
    name,
    password: hashPassword(),
    profileUrl: faker.image.avatarLegacy(),
    role: createRole(),
    tags: {
      connect: faker.helpers
        .arrayElements(tags, {
          max: articleConfig.TAGS_MAX_SIZE,
          min: 1,
        })
        .map(tag => ({
          id: tag.id,
        })),
    },
    updatedAt: createdAt,
    username: createUsername(firstName, name),
  };
};

export const createUsers = async (payload: {
  prisma: PrismaClient;
  tags: Tag[];
  years: number;
}): Promise<User[]> => {
  const { prisma, tags, years } = payload;

  const usersData: Prisma.UserCreateInput[] = faker.helpers.multiple(
    () => {
      return createUsersData({
        prisma,
        tags,
        years,
      });
    },
    {
      count: {
        max: 15,
        min: 5,
      },
    }
  );

  return Promise.all(
    usersData.map(userData =>
      prisma.user.create({
        data: userData,
      })
    )
  );
};
