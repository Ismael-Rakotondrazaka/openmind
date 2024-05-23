import { type Prisma, type Tag } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { TagSchema } from "~/prisma/generated/zod";

export const findOne = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.TagWhereInput;
  orderBy?: Prisma.TagOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<Tag | null> => {
  const rawTag = await prisma.tag.findFirst({
    where,
    orderBy,
    skip,
    take,
  });

  let parsedTag: Tag | null = null;

  if (rawTag !== null) {
    parsedTag = TagSchema.parse(rawTag);
  }

  return parsedTag;
};
