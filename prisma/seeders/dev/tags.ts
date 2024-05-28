import { faker } from "@faker-js/faker";
import type { Prisma, PrismaClient, Tag } from "@prisma/client";

const createTagData = (): Prisma.TagCreateManyInput => {
  return {
    value: faker.lorem.words({
      min: 1,
      max: 3,
    }),
  };
};

export const createTags = async (payload: {
  prisma: PrismaClient;
}): Promise<Tag[]> => {
  const { prisma } = payload;

  const data: Prisma.TagCreateManyInput[] = faker.helpers.multiple(
    () => createTagData(),
    {
      count: {
        min: 15,
        max: 30,
      },
    },
  );

  await prisma.tag.createMany({
    data,
  });

  return prisma.tag.findMany();
};
