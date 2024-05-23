import { type Prisma, type User, type SavedArticle } from "@prisma/client";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";
import { type SavedArticleFull } from "~/utils";

export const createFullOne = ({
  authUser,
  data,
}: {
  authUser: User;
  data: Prisma.SavedArticleCreateArgs["data"];
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
