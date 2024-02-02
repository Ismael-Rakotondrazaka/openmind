import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const deleteOne = async ({
  where,
}: {
  where: Prisma.ViewWhereUniqueInput;
}): Promise<void> => {
  await prisma.view.delete({
    where,
  });
};
