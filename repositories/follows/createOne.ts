import { type Prisma, type Follow } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { FollowSchema } from "~/prisma/generated/zod";

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
