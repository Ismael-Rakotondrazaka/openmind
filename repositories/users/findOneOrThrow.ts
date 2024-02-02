import { type Prisma, type User } from "@prisma/client";
import { findOne } from "./findOne";
import {} from "~/utils";

export const findOneOrThrow = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<User> => {
  const reaction: User | null = await findOne({
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
