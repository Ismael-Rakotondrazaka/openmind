import { type Follow, type Prisma } from "@prisma/client";
import { FollowSchema } from "~/prisma/generated/zod";
import { prisma } from "~/server/middleware/0.prisma";

export const createOne = async ({
  data,
}: {
  data:
    | (Prisma.Without<
        Prisma.FollowCreateInput,
        Prisma.FollowUncheckedCreateInput
      > &
        Prisma.FollowUncheckedCreateInput)
    | (Prisma.Without<
        Prisma.FollowUncheckedCreateInput,
        Prisma.FollowCreateInput
      > &
        Prisma.FollowCreateInput);
}): Promise<Follow> => {
  const rawFollow = await prisma.follow.create({
    data,
  });

  const parsedFollow: Follow = FollowSchema.parse(rawFollow);

  return parsedFollow;
};
