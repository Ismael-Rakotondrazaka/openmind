import { type Prisma, type Tag } from "@prisma/client";
import { TagSchema } from "~/prisma/generated/zod";
import { prisma } from "~/server/middleware/0.prisma";

export const findMany = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.TagWhereInput;
  orderBy?: Prisma.TagOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<Tag[]> => {
  return prisma.tag
    .findMany({
      where,
      orderBy,
      take,
      skip,
    })
    .then((tags): Tag[] => {
      return tags.map((tag): Tag => {
        const parsedTag: Tag = TagSchema.parse(tag);

        return parsedTag;
      });
    });
};
