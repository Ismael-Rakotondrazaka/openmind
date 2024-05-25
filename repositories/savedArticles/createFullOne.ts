import { type Prisma, type SavedArticle, type User } from "@prisma/client";
import { type SavedArticleFull } from "~/utils";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";

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
