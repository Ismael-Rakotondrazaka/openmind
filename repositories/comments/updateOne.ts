import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { type Comment } from "~/utils";

export const updateOne = ({
  data,
  where,
}: {
  data:
    | (Prisma.Without<
        Prisma.CommentUpdateInput,
        Prisma.CommentUncheckedUpdateInput
      > &
        Prisma.CommentUncheckedUpdateInput)
    | (Prisma.Without<
        Prisma.CommentUncheckedUpdateInput,
        Prisma.CommentUpdateInput
      > &
        Prisma.CommentUpdateInput);
  where: Prisma.CommentUpdateArgs["where"];
}): Promise<Comment> => {
  return prisma.comment.update({
    where,
    data,
  });
};
