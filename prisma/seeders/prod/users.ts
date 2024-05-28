import { faker } from "@faker-js/faker";
import type { Prisma, PrismaClient, Role, Tag, User } from "@prisma/client";

import { hashSync } from "bcrypt";

export const hashPassword = (): string => {
  const passwordSaltRounds: number = 10;

  return hashSync(faker.internet.password(), passwordSaltRounds);
};

type Gender = "MALE" | "FEMALE";

const createGender = (): Gender => {
  return faker.helpers.arrayElement<Gender>(["FEMALE", "MALE"]);
};

const createFirstName = (gender: Gender): string => {
  const mappedGender: Record<Gender, "female" | "male"> = {
    FEMALE: "female",
    MALE: "male",
  };

  return faker.person.firstName(mappedGender[gender]);
};

const createName = (gender: Gender): string => {
  const mappedGender: Record<Gender, "female" | "male"> = {
    FEMALE: "female",
    MALE: "male",
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
  return "user";
};

const createUsersData = (payload: {
  prisma: PrismaClient;
  years?: number;
  tags: Tag[];
}): Prisma.UserCreateInput => {
  const { years, tags } = payload;

  const gender: Gender = createGender();
  const firstName: string = createFirstName(gender);
  const name: string = createName(gender);
  const createdAt: Date = faker.date.past({
    years,
  });

  return {
    email: faker.internet
      .email({
        firstName,
        lastName: name,
      })
      .toLowerCase(),
    firstName,
    name,
    username: createUsername(firstName, name),
    password: hashPassword(),
    role: createRole(),
    profileUrl: faker.image.avatarLegacy(),
    createdAt,
    updatedAt: createdAt,
    emailVerifiedAt: createdAt,
    tags: {
      connect: faker.helpers
        .arrayElements(tags, {
          max: articleConfig.TAGS_MAX_SIZE,
          min: 1,
        })
        .map((tag) => ({
          id: tag.id,
        })),
    },
  };
};

export const createUsers = async (payload: {
  prisma: PrismaClient;
  years: number;
  tags: Tag[];
}): Promise<User[]> => {
  const { prisma, years, tags } = payload;

  const usersData: Prisma.UserCreateInput[] = faker.helpers.multiple(
    () => {
      return createUsersData({
        prisma,
        years,
        tags,
      });
    },
    {
      count: {
        min: 5,
        max: 15,
      },
    },
  );

  return Promise.all(
    usersData.map((userData) =>
      prisma.user.create({
        data: userData,
      }),
    ),
  );
};
