import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { ViewFullSchema, type ViewFull } from "~/utils";

export const findFullMany = ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.ViewWhereInput;
  orderBy?: Prisma.ViewOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<ViewFull[]> => {
  return prisma.view
    .findMany({
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
      take,
      skip,
    })
    .then((views): ViewFull[] => {
      return views.map((view): ViewFull => {
        const parsedView: ViewFull = ViewFullSchema.parse(view);

        return parsedView;
      });
    });
};
