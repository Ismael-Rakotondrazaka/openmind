import { type Prisma, type User } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { UserFullSchema, type UserFull } from "~/utils";

export const findFullOne = async ({
  authUser,
  where,
  orderBy,
  skip,
  take,
}: {
  authUser: User | null;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
  skip?: number;
  take?: number;
}): Promise<UserFull | null> => {
  const user = await prisma.user.findFirst({
    where,
    /* eslint-disable indent */
    include: {
      followers:
        authUser === null
          ? undefined
          : {
              where: {
                followerId: authUser.id,
              },
              include: {
                follower: {
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
                following: {
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
            },
      following:
        authUser === null
          ? undefined
          : {
              where: {
                followingId: authUser.id,
              },
              include: {
                follower: {
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
                following: {
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
            },
      tags: true,
      _count: {
        select: {
          followers: true,
          following: true,

          tags: true,
          articles: {
            where: {
              deletedAt: null,
              isVisible: true,
            },
          },
        },
      },
    },
    /* eslint-enable indent */
    orderBy,
    skip,
    take,
  });

  if (user !== null) {
    const auth: ShowUserData["user"]["auth"] = {
      follower: null,
      following: null,
    };

    if (user.followers !== undefined && user.followers.length > 0) {
      auth.follower = user.followers[0] as Follow & {
        following: Omit<User, "password" | "email" | "emailVerifiedAt">;
        follower: Omit<User, "password" | "email" | "emailVerifiedAt">;
      };
    }

    if (user.following !== undefined && user.following.length > 0) {
      auth.following = user.following[0] as Follow & {
        following: Omit<User, "password" | "email" | "emailVerifiedAt">;
        follower: Omit<User, "password" | "email" | "emailVerifiedAt">;
      };
    }

    const parsedUser: UserFull = UserFullSchema.parse({
      ...user,
      auth,
    });

    return parsedUser;
  } else {
    return null;
  }
};
