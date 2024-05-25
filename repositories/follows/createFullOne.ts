import { type Follow, type Prisma } from "@prisma/client";
import { type FollowFull } from "~/utils";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";

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
