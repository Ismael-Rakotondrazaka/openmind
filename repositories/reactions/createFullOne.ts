import { type Prisma } from "@prisma/client";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";
import { type ReactionFull, type Reaction } from "~/utils";

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
