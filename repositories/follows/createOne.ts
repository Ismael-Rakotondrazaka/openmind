import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { type Follow, FollowSchema } from "~/utils";

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
