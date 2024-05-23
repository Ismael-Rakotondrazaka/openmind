import { type Prisma } from "@prisma/client";
import { type Comment } from "~/prisma/generated/zod";
import { prisma } from "~/server/middleware/0.prisma";

export const updateOne = ({
  data,
  where,
}: {
  data: Prisma.CommentUpdateArgs["data"];
  where: Prisma.CommentUpdateArgs["where"];
}): Promise<Comment> => {
  return prisma.comment.update({
    where,
    data,
  });
};
