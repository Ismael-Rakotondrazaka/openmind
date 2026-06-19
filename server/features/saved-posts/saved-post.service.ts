import type { PaginationResult } from '#shared/features/paginations';
import type {
  IndexSavedPostsQuery,
  SavedPostModel,
  ToggleSavedPostBody,
} from '#shared/features/saved-posts';

import { buildPagination } from '../../core/paginations/pagination';

export const getSavedPosts = async (
  userId: string,
  filters: IndexSavedPostsQuery
): Promise<PaginationResult<SavedPostModel>> => {
  const { skip, take } = buildPagination(filters);

  const where = {
    userId,
    ...(filters.postId ? { postId: filters.postId } : {}),
  };

  const [rows, count] = await prisma.$transaction([
    prisma.savedPost.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      where,
    }),
    prisma.savedPost.count({ where }),
  ]);

  return { count, data: rows as SavedPostModel[] };
};

export const checkIsSavedPost = async (
  userId: string,
  postId: string
): Promise<boolean> => {
  const count = await prisma.savedPost.count({ where: { postId, userId } });
  return count > 0;
};

export const toggleSavedPost = async (
  userId: string,
  body: ToggleSavedPostBody
): Promise<{ saved: boolean; savedPost: null | SavedPostModel }> => {
  const { postId } = body;

  const existing = await prisma.savedPost.findUnique({
    where: { userId_postId: { postId, userId } },
  });

  if (existing) {
    await prisma.savedPost.delete({
      where: { userId_postId: { postId, userId } },
    });
    return { saved: false, savedPost: null };
  }

  const savedPost = await prisma.savedPost.create({ data: { postId, userId } });

  return { saved: true, savedPost: savedPost as SavedPostModel };
};
