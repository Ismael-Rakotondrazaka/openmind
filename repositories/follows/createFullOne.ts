import { type Prisma } from "@prisma/client";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";
import { type FollowFull, type Follow } from "~/utils";

export const createFullOne = ({
  data,
}: {
  data:
    | (Prisma.Without<
        Prisma.FollowCreateInput,
        Prisma.FollowUncheckedCreateInput
      > &
        Prisma.FollowUncheckedCreateInput)
    | (Prisma.Without<
        Prisma.FollowUncheckedCreateInput,
        Prisma.FollowCreateInput
      > &
        Prisma.FollowCreateInput);
}): Promise<FollowFull> => {
  return createOne({
    data,
  }).then((comment: Follow) =>
    findFullOneOrThrow({
      where: {
        id: comment.id,
      },
    }),
  );
};
