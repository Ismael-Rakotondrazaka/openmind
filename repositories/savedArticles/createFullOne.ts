import { type Prisma, type User } from "@prisma/client";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";
import { type SavedArticleFull, type SavedArticle } from "~/utils";

export const createFullOne = ({
  authUser,
  data,
}: {
  authUser: User;
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
}): Promise<SavedArticleFull> => {
  return createOne({
    data,
  }).then((savedArticle: SavedArticle) =>
    findFullOneOrThrow({
      where: {
        articleId: savedArticle.articleId,
        userId: savedArticle.userId,
      },
      authUser,
    }),
  );
};
