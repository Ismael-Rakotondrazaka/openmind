import { type Article, type Prisma, type User } from "@prisma/client";
import { type ArticleFull } from "~/utils";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";

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
