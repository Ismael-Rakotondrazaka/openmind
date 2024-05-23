import { type Prisma, type View } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { ViewSchema } from "~/prisma/generated/zod";

export const createOne = async ({
  data,
}: {
  data:
    | (Prisma.Without<Prisma.ViewCreateInput, Prisma.ViewUncheckedCreateInput> &
        Prisma.ViewUncheckedCreateInput)
    | (Prisma.Without<Prisma.ViewUncheckedCreateInput, Prisma.ViewCreateInput> &
        Prisma.ViewCreateInput);
}): Promise<View> => {
  const rawView = await prisma.view.create({
    data,
  });

  const parsedView: View = ViewSchema.parse(rawView);

  return parsedView;
};
