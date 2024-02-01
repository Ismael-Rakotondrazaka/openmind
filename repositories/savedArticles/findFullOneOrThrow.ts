import { type Prisma, type User } from "@prisma/client";
import { findFullOne } from "./findFullOne";
import { type SavedArticleFull } from "~/utils";

export const findFullOneOrThrow = async ({
  authUser,
  where,
  orderBy,
  skip,
  take,
}: {
  authUser: User;
  where?: Prisma.SavedArticleWhereInput;
  orderBy?: Prisma.SavedArticleOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<SavedArticleFull> => {
  const reaction: SavedArticleFull | null = await findFullOne({
    where,
    orderBy,
    skip,
    take,
    authUser,
  });

  if (reaction === null) {
    throw new Error("Not implemented yet");
  }

  return reaction;
};
