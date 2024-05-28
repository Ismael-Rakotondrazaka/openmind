import { type Prisma, type View } from "@prisma/client";
import { type ViewFull } from "~/utils";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";

export const createFullOne = ({
  data,
}: {
  data: Prisma.ViewCreateArgs["data"];
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
