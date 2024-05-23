import { type Prisma } from "@prisma/client";
import { type ReactionFull } from "~/utils";
import { findFullOne } from "./findFullOne";

export const findFullOneOrThrow = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.ReactionWhereInput;
  orderBy?: Prisma.ReactionOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<ReactionFull> => {
  const reaction: ReactionFull | null = await findFullOne({
    where,
    orderBy,
    skip,
    take,
  });

  if (reaction === null) {
    throw new Error("Not implemented yet");
  }

  return reaction;
};
