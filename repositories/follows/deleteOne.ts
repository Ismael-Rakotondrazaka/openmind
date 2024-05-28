import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const deleteOne = async ({
  where,
}: {
  where: Prisma.FollowWhereUniqueInput;
}): Promise<void> => {
  await prisma.follow.delete({
    where,
  });
};
