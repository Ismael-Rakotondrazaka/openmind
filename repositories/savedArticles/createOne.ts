import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { type SavedArticle, SavedArticleSchema } from "~/utils";

export const createOne = async ({
  data,
}: {
  data:
    | (Prisma.Without<
        Prisma.SavedArticleCreateInput,
        Prisma.SavedArticleUncheckedCreateInput
      > &
        Prisma.SavedArticleUncheckedCreateInput)
    | (Prisma.Without<
        Prisma.SavedArticleUncheckedCreateInput,
        Prisma.SavedArticleCreateInput
      > &
        Prisma.SavedArticleCreateInput);
}): Promise<SavedArticle> => {
  const rawSavedArticle = await prisma.savedArticle.create({
    data,
  });

  const parsedSavedArticle: SavedArticle =
    SavedArticleSchema.parse(rawSavedArticle);

  return parsedSavedArticle;
};
