import { type Article, type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const updateOne = ({
  data,
  where,
}: {
  data: Prisma.ArticleUpdateArgs["data"];
  where: Prisma.ArticleUpdateArgs["where"];
}): Promise<Article> => {
  return prisma.article.update({
    where,
    data,
  });
};
