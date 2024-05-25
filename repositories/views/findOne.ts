import { type Prisma, type View } from "@prisma/client";
import { ViewSchema } from "~/prisma/generated/zod";
import { prisma } from "~/server/middleware/0.prisma";

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
