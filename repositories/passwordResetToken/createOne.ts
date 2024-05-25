import { type PasswordResetToken, type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const createOne = async ({
  data,
}: {
  data: Prisma.PasswordResetTokenCreateArgs["data"];
}): Promise<PasswordResetToken> => {
  const passwordResetToken = await prisma.passwordResetToken.create({
    data,
  });

  return passwordResetToken;
};
