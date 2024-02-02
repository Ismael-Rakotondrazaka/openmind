import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { type ActivationTokenFull, ActivationTokenFullSchema } from "~/utils";

export const findFullOne = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.ActivationTokenWhereInput;
  orderBy?: Prisma.ActivationTokenOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<ActivationTokenFull | null> => {
  const reaction = await prisma.activationToken.findFirst({
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

  if (reaction !== null) {
    const parsedActivationToken: ActivationTokenFull =
      ActivationTokenFullSchema.parse(reaction);

    return parsedActivationToken;
  } else {
    return null;
  }
};
