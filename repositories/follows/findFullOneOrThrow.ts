import { type Prisma } from "@prisma/client";
import { findFullOne } from "./findFullOne";
import { type FollowFull } from "~/utils";

export const findFullOneOrThrow = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.FollowWhereInput;
  orderBy?: Prisma.FollowOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<FollowFull> => {
  const follow: FollowFull | null = await findFullOne({
    where,
    orderBy,
    skip,
    take,
  });

  if (follow === null) {
    throw new Error("Not implemented yet");
  }

  return follow;
};
