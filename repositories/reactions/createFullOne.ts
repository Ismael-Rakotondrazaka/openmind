import { type Prisma } from "@prisma/client";
import { type Reaction, type ReactionFull } from "~/utils";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";

export const createFullOne = ({
  data,
}: {
  data:
    | (Prisma.Without<
        Prisma.ReactionCreateInput,
        Prisma.ReactionUncheckedCreateInput
      > &
        Prisma.ReactionUncheckedCreateInput)
    | (Prisma.Without<
        Prisma.ReactionUncheckedCreateInput,
        Prisma.ReactionCreateInput
      > &
        Prisma.ReactionCreateInput);
}): Promise<ReactionFull> => {
  return createOne({
    data,
  }).then((comment: Reaction) =>
    findFullOneOrThrow({
      where: {
        id: comment.id,
      },
    }),
  );
};
