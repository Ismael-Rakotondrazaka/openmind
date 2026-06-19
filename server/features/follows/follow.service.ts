import type {
  FollowModel,
  FollowWithUsers,
  IndexFollowsQuery,
  ToggleFollowBody,
} from '#shared/features/follows';
import type { PaginationResult } from '#shared/features/paginations';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

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

export const getFollows = async (
  filters: IndexFollowsQuery
): Promise<PaginationResult<FollowWithUsers>> => {
  const page = filters.page ?? DEFAULT_PAGE;
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * pageSize;

  const where = {
    ...(filters.followerId ? { followerId: filters.followerId } : {}),
    ...(filters.followingId ? { followingId: filters.followingId } : {}),
  };

  const [rows, count] = await prisma.$transaction([
    prisma.follow.findMany({
      include: {
        follower: { select: userSelect },
        following: { select: userSelect },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      where,
    }),
    prisma.follow.count({ where }),
  ]);

  return { count, data: rows as unknown as FollowWithUsers[] };
};

export const toggleFollow = async (
  followerId: string,
  body: ToggleFollowBody
): Promise<{ follow: FollowModel | null; following: boolean }> => {
  const { followingId } = body;

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.follow.delete({
        where: { followerId_followingId: { followerId, followingId } },
      }),
      prisma.user.update({
        data: { followingCount: { decrement: 1 } },
        where: { id: followerId },
      }),
      prisma.user.update({
        data: { followerCount: { decrement: 1 } },
        where: { id: followingId },
      }),
    ]);

    return { follow: null, following: false };
  }

  const [follow] = await prisma.$transaction([
    prisma.follow.create({ data: { followerId, followingId } }),
    prisma.user.update({
      data: { followingCount: { increment: 1 } },
      where: { id: followerId },
    }),
    prisma.user.update({
      data: { followerCount: { increment: 1 } },
      where: { id: followingId },
    }),
  ]);

  return { follow: follow as FollowModel, following: true };
};
