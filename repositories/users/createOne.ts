import { type Prisma, type User } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const createOne = ({
  data,
}: {
  data:
    | (Prisma.Without<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput> &
        Prisma.UserUncheckedCreateInput)
    | (Prisma.Without<Prisma.UserUncheckedCreateInput, Prisma.UserCreateInput> &
        Prisma.UserCreateInput);
}): Promise<User> => {
  return prisma.user.create({
    data,
  });
};
