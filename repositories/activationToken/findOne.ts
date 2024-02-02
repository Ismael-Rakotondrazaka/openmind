import { type Prisma, type ActivationToken } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const findOne = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.ActivationTokenWhereInput;
  orderBy?: Prisma.ActivationTokenOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<ActivationToken | null> => {
  const activationToken: ActivationToken | null =
    await prisma.activationToken.findFirst({
      where,
      orderBy,
      skip,
      take,
    });

  return activationToken;
};
