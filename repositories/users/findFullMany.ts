import { type Follow, type Prisma, type User } from "@prisma/client";
import { prisma } from "~/server/middleware/0.prisma";
import { UserFullSchema, type UserFull } from "~/utils";

export const findFullMany = ({
  authUser,
  where,
  orderBy,
  skip,
  take,
}: {
  authUser: User | null;
  where?: Prisma.UserWhereInput;
  orderBy?:
    | Prisma.UserOrderByWithRelationInput
    | Prisma.UserOrderByWithRelationInput[];
  skip?: number;
  take?: number;
}): Promise<UserFull[]> => {
  return prisma.user
    .findMany({
      where,

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

      orderBy,
      take,
      skip,
    })
    .then((users): UserFull[] => {
      return users.map((user): UserFull => {
        const _auth: IndexUserData["users"][0]["_auth"] = {
          follower: null,
          following: null,
        };

        if (authUser !== null) {
          if (user.followers.length > 0) {
            _auth.follower = user.followers[0] as Follow & {
              following: User;
              follower: User;
            };
          }

          if (user.following.length > 0) {
            _auth.following = user.following[0] as Follow & {
              following: User;
              follower: User;
            };
          }
        }

        // we parse to remove excess properties
        const parsedUser: UserFull = UserFullSchema.parse({
          ...user,
          _auth,
        });

        return parsedUser;
      });
    });
};
