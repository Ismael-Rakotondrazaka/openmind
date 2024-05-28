import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const count = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.ArticleWhereInput;
  orderBy?: Prisma.ArticleOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<number> => {
  return prisma.article.count({
    where,
    orderBy,
    skip,
    take,
  });
};
