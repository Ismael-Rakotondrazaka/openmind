import { type Prisma, type PasswordResetToken } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const findOne = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.PasswordResetTokenWhereInput;
  orderBy?: Prisma.PasswordResetTokenOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<PasswordResetToken | null> => {
  const passwordResetToken: PasswordResetToken | null =
    await prisma.passwordResetToken.findFirst({
      where,
      orderBy,
      skip,
      take,
    });

  return passwordResetToken;
};
