import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { type View, ViewSchema } from "~/utils";

export const findOne = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.ViewWhereInput;
  orderBy?: Prisma.ViewOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<View | null> => {
  const rawView = await prisma.view.findFirst({
    where,
    orderBy,
    skip,
    take,
  });

  let parsedView: View | null = null;

  if (rawView !== null) {
    parsedView = ViewSchema.parse(rawView);
  }

  return parsedView;
};
