import { type Prisma, type SavedArticle } from "@prisma/client";
import { SavedArticleSchema } from "~/prisma/generated/zod";
import { prisma } from "~/server/middleware/0.prisma";

export const createOne = async ({
  data,
}: {
  data: Prisma.SavedArticleCreateArgs["data"];
}): Promise<SavedArticle> => {
  const rawSavedArticle = await prisma.savedArticle.create({
    data,
  });

  const parsedSavedArticle: SavedArticle =
    SavedArticleSchema.parse(rawSavedArticle);

  return parsedSavedArticle;
};
