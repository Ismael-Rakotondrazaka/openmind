import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { ViewFullSchema, type ViewFull } from "~/utils";

export const updateFullOne = ({
  data,
  where,
}: {
  data:
    | (Prisma.Without<Prisma.ViewUpdateInput, Prisma.ViewUncheckedUpdateInput> &
        Prisma.ViewUncheckedUpdateInput)
    | (Prisma.Without<Prisma.ViewUncheckedUpdateInput, Prisma.ViewUpdateInput> &
        Prisma.ViewUpdateInput);
  where: Prisma.ViewUpdateArgs["where"];
}): Promise<ViewFull> => {
  return prisma.view
    .update({
      where,
      data,
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
    })
    .then((view) => {
      const parsedView: ViewFull = ViewFullSchema.parse(view);

      return parsedView;
    });
};
