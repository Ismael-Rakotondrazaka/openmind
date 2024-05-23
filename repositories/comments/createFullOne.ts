import { type Comment, type Prisma, type User } from "@prisma/client";
import { type CommentFull } from "~/utils";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";

export const createFullOne = ({
  authUser,
  data,
}: {
  authUser: User | null;
  data:
    | (Prisma.Without<
        Prisma.CommentCreateInput,
        Prisma.CommentUncheckedCreateInput
      > &
        Prisma.CommentUncheckedCreateInput)
    | (Prisma.Without<
        Prisma.CommentUncheckedCreateInput,
        Prisma.CommentCreateInput
      > &
        Prisma.CommentCreateInput);
}): Promise<CommentFull> => {
  return createOne({
    data,
  }).then((comment: Comment) =>
    findFullOneOrThrow({
      where: {
        id: comment.id,
      },
      authUser,
    }),
  );
};
