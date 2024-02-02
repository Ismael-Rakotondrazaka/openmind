import { type Prisma, type User } from "@prisma/client";
import { findFullOne } from "./findFullOne";
import { type CommentFull } from "~/utils";

export const findFullOneOrThrow = async ({
  authUser,
  where,
  orderBy,
  skip,
  take,
}: {
  authUser: User | null;
  where?: Prisma.CommentWhereInput;
  orderBy?: Prisma.CommentOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<CommentFull> => {
  const comment: CommentFull | null = await findFullOne({
    authUser,
    where,
    orderBy,
    skip,
    take,
  });

  if (comment === null) {
    throw new Error("Not implemented yet");
  }

  return comment;
};
