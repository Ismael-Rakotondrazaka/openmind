import { faker } from "@faker-js/faker";
import { type User, type Role, PrismaClient, Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";

const PASSWORD_DEFAULT_VALUE = "password";
export const hashPassword = (): string => {
  const passwordSaltRounds: number = 10;

  return hashSync(PASSWORD_DEFAULT_VALUE, passwordSaltRounds);
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

const createUser = (payload: {
  prisma: PrismaClient;
  years?: number;
}): Prisma.UserCreateInput => {
  const { years } = payload;

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
  };
};

export const createUsers = async (payload: {
  prisma: PrismaClient;
  years: number;
}): Promise<User[]> => {
  const { prisma, years } = payload;

  const data: Prisma.UserCreateInput[] = faker.helpers.multiple(
    () => {
      return createUser({
        prisma,
        years,
      });
    },
    {
      count: {
        min: 40,
        max: 70,
      },
    },
  );

  await prisma.user.createMany({
    data,
  });

  return prisma.user.findMany();
};
