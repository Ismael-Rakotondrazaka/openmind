import { type Article, type Prisma } from "@prisma/client";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";
import { type ArticleFull } from "~/utils";

export const createFullOne = ({
  authUser,
  data,
}: {
  authUser: User | null;
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
