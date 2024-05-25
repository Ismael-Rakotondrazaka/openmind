import { type Prisma, type User } from "@prisma/client";
import { type ArticleFull } from "~/utils";
import { findFullOne } from "./findFullOne";

export const findFullOneOrThrow = async ({
  authUser,
  where,
  orderBy,
  skip,
  take,
}: {
  authUser: User | null;
  where?: Prisma.ArticleWhereInput;
  orderBy?: Prisma.ArticleOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<ArticleFull> => {
  const article: ArticleFull | null = await findFullOne({
    authUser,
    where,
    orderBy,
    skip,
    take,
  });

  if (article === null) {
    throw new Error("Not implemented yet");
  }

  return article;
};
