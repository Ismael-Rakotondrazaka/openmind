import { type Article, type Prisma, type User } from "@prisma/client";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";
import { type ArticleFull } from "~/utils";

export const createFullOne = ({
  authUser,
  data,
}: {
  authUser: User | null;
  data: Prisma.ArticleCreateArgs["data"];
}): Promise<ArticleFull> => {
  return createOne({
    data,
  }).then((article: Article) =>
    findFullOneOrThrow({
      where: {
        id: article.id,
      },
      authUser,
    }),
  );
};
