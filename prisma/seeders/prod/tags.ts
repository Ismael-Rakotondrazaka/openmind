import type { Prisma, PrismaClient, Tag } from "@prisma/client";

export const createTags = async (payload: {
  prisma: PrismaClient;
  values: string[];
}): Promise<Tag[]> => {
  const { prisma, values } = payload;

  const data: Prisma.TagCreateManyInput[] = values.map((value) => ({
    value,
  }));

  await prisma.tag.createMany({
    data,
  });

  return prisma.tag.findMany();
};
