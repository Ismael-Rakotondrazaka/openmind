import { type Prisma, type Follow } from "@prisma/client";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";
import { type FollowFull } from "~/utils";

export const createFullOne = ({
  data,
}: {
  data: Prisma.FollowCreateArgs["data"];
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
