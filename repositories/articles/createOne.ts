import { type Article, type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const createOne = ({
  data,
}: {
  data: Prisma.ArticleCreateArgs["data"];
}): Promise<Article> => {
  return prisma.article.create({
    data,
  });
};
