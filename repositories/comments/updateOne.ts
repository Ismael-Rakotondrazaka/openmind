import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { type Comment } from "~/prisma/generated/zod";

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
