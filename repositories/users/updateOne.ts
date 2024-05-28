import { type Prisma, type User } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";

export const updateOne = ({
  data,
  where,
}: {
  data:
    | (Prisma.Without<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput> &
        Prisma.UserUncheckedUpdateInput)
    | (Prisma.Without<Prisma.UserUncheckedUpdateInput, Prisma.UserUpdateInput> &
        Prisma.UserUpdateInput);
  where: Prisma.UserUpdateArgs["where"];
}): Promise<User> => {
  return prisma.user.update({
    where,
    data,
  });
};
