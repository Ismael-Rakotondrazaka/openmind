import { type Prisma, type Follow } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { FollowSchema } from "~/prisma/generated/zod";

export const updateOne = async ({
  data,
  where,
}: {
  data:
    | (Prisma.Without<
        Prisma.FollowUpdateInput,
        Prisma.FollowUncheckedUpdateInput
      > &
        Prisma.FollowUncheckedUpdateInput)
    | (Prisma.Without<
        Prisma.FollowUncheckedUpdateInput,
        Prisma.FollowUpdateInput
      > &
        Prisma.FollowUpdateInput);
  where: Prisma.FollowUpdateArgs["where"];
}): Promise<Follow> => {
  const rawFollow = await prisma.follow.update({
    where,
    data,
  });

  const parsedFollow: Follow = FollowSchema.parse(rawFollow);

  return parsedFollow;
};
