import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { ViewFullSchema, type ViewFull } from "~/utils";

export const findFullOne = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.ViewWhereInput;
  orderBy?: Prisma.ViewOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<ViewFull | null> => {
  const view = await prisma.view.findFirst({
    where,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          firstName: true,
          profileUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      },
    },
    orderBy,
    skip,
    take,
  });

  if (view !== null) {
    const parsedView: ViewFull = ViewFullSchema.parse(view);

    return parsedView;
  } else {
    return null;
  }
};
