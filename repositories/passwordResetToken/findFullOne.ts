import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import {
  PasswordResetTokenFullSchema,
  type PasswordResetTokenFull,
} from "~/utils";

export const findFullOne = async ({
  where,
  orderBy,
  skip,
  take,
}: {
  where?: Prisma.PasswordResetTokenWhereInput;
  orderBy?: Prisma.PasswordResetTokenOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<PasswordResetTokenFull | null> => {
  const reaction = await prisma.passwordResetToken.findFirst({
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
    const parsedPasswordResetToken: PasswordResetTokenFull =
      PasswordResetTokenFullSchema.parse(reaction);

    return parsedPasswordResetToken;
  } else {
    return null;
  }
};
