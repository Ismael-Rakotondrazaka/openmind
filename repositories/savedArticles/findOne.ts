import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { type SavedArticle } from "~/utils";

export const findOne = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.SavedArticleWhereInput;
  orderBy?: Prisma.SavedArticleOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<SavedArticle | null> => {
  return prisma.savedArticle.findFirst({
    where,
    orderBy,
    skip,
    take,
  });
};
