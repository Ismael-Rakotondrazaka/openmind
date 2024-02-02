import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const updateOne = ({
  data,
  where,
}: {
  data:
    | (Prisma.Without<
        Prisma.ArticleUpdateInput,
        Prisma.ArticleUncheckedUpdateInput
      > &
        Prisma.ArticleUncheckedUpdateInput)
    | (Prisma.Without<
        Prisma.ArticleUncheckedUpdateInput,
        Prisma.ArticleUpdateInput
      > &
        Prisma.ArticleUpdateInput);
  where: Prisma.ArticleUpdateArgs["where"];
}): Promise<Article> => {
  return prisma.article.update({
    where,
    data,
  });
};
