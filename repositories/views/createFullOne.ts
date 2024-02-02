import { type Prisma } from "@prisma/client";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";
import { type ViewFull, type View } from "~/utils";

export const createFullOne = ({
  data,
}: {
  data:
    | (Prisma.Without<Prisma.ViewCreateInput, Prisma.ViewUncheckedCreateInput> &
        Prisma.ViewUncheckedCreateInput)
    | (Prisma.Without<Prisma.ViewUncheckedCreateInput, Prisma.ViewCreateInput> &
        Prisma.ViewCreateInput);
}): Promise<ViewFull> => {
  return createOne({
    data,
  }).then((comment: View) =>
    findFullOneOrThrow({
      where: {
        id: comment.id,
      },
    }),
  );
};
