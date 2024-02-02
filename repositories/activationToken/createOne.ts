import { type Prisma, type ActivationToken } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const createOne = async ({
  data,
}: {
  data:
    | (Prisma.Without<
        Prisma.ActivationTokenCreateInput,
        Prisma.ActivationTokenUncheckedCreateInput
      > &
        Prisma.ActivationTokenUncheckedCreateInput)
    | (Prisma.Without<
        Prisma.ActivationTokenUncheckedCreateInput,
        Prisma.ActivationTokenCreateInput
      > &
        Prisma.ActivationTokenCreateInput);
}): Promise<ActivationToken> => {
  const activationToken = await prisma.activationToken.create({
    data,
  });

  return activationToken;
};
