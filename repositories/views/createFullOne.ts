import { type Prisma, type View } from "@prisma/client";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";
import { type ViewFull } from "~/utils";

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
