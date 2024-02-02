import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const findOne = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.ArticleWhereInput;
  orderBy?: Prisma.ArticleOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<Article | null> => {
  const article: Article | null = await prisma.article.findFirst({
    where,
    orderBy,
    skip,
    take,
  });
  return article;
};
