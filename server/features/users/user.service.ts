import type { PaginationResult } from '#shared/features/paginations';
import type {
  IndexUsersQuery,
  UpdateProfileBody,
  UserProfile,
} from '#shared/features/users';

import { UserConfig } from '#shared/features/users';

const userSelect = {
  createdAt: true,
  firstName: true,
  followerCount: true,
  followingCount: true,
  id: true,
  imageUrl: true,
  lastName: true,
  postsCount: true,
  role: true,
  username: true,
};

export const getUsers = async (
  filters: IndexUsersQuery
): Promise<PaginationResult<UserProfile>> => {
  const page = filters.page ?? UserConfig.PAGE_DEFAULT;
  const pageSize = filters.pageSize ?? UserConfig.PAGE_SIZE_DEFAULT;
  const skip = (page - 1) * pageSize;

  const where = {
    deletedAt: null,
    ...(filters.role && { role: filters.role }),
    ...(filters.username && { username: filters.username }),
    ...(filters.search && {
      OR: [
        {
          firstName: { contains: filters.search, mode: 'insensitive' as const },
        },
        {
          lastName: { contains: filters.search, mode: 'insensitive' as const },
        },
        {
          username: { contains: filters.search, mode: 'insensitive' as const },
        },
      ],
    }),
  };

  const [rows, count] = await prisma.$transaction([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: userSelect,
      skip,
      take: pageSize,
      where,
    }),
    prisma.user.count({ where }),
  ]);

  return { count, data: rows as UserProfile[] };
};

export const getUser = async (id: string): Promise<null | UserProfile> => {
  return prisma.user.findFirst({
    select: userSelect,
    where: { deletedAt: null, id },
  }) as Promise<null | UserProfile>;
};

export const updateUser = async (
  id: string,
  input: UpdateProfileBody
): Promise<UserProfile> => {
  return prisma.user.update({
    data: input,
    select: userSelect,
    where: { id },
  }) as Promise<UserProfile>;
};

export const deleteUser = async (id: string): Promise<void> => {
  await prisma.user.update({
    data: { deletedAt: new Date() },
    where: { id },
  });
};

export const checkUsernameExists = async (
  username: string
): Promise<boolean> => {
  const count = await prisma.user.count({
    where: { deletedAt: null, username },
  });
  return count > 0;
};
