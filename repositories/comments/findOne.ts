import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { type Comment } from "~/utils";

export const findOne = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.CommentWhereInput;
  orderBy?: Prisma.CommentOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<Comment | null> => {
  const comment: Comment | null = await prisma.comment.findFirst({
    where,
    orderBy,
    skip,
    take,
  });
  return comment;
};
