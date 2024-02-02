import { type Prisma, type Comment } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const createOne = ({
  data,
}: {
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
}): Promise<Comment> => {
  return prisma.comment.create({
    data,
  });
};
