import { type Prisma, type View } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { ViewSchema } from "~/prisma/generated/zod";

export const updateOne = async ({
  data,
  where,
}: {
  data:
    | (Prisma.Without<Prisma.ViewUpdateInput, Prisma.ViewUncheckedUpdateInput> &
        Prisma.ViewUncheckedUpdateInput)
    | (Prisma.Without<Prisma.ViewUncheckedUpdateInput, Prisma.ViewUpdateInput> &
        Prisma.ViewUpdateInput);
  where: Prisma.ViewUpdateArgs["where"];
}): Promise<View> => {
  const rawView = await prisma.view.update({
    where,
    data,
  });

  const parsedView: View = ViewSchema.parse(rawView);

  return parsedView;
};
