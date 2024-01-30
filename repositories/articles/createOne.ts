import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const createOne = ({
  data,
}: {
  data:
    | (Prisma.Without<
        Prisma.ArticleCreateInput,
        Prisma.ArticleUncheckedCreateInput
      > &
        Prisma.ArticleUncheckedCreateInput)
    | (Prisma.Without<
        Prisma.ArticleUncheckedCreateInput,
        Prisma.ArticleCreateInput
      > &
        Prisma.ArticleCreateInput);
}): Promise<Article> => {
  return prisma.article.create({
    data,
  });
};
