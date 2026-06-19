import type {
  IndexReactionsData,
  IndexReactionsQuery,
  ReactionModel,
  ToggleReactionBody,
} from '#shared/features/reactions';

import { buildPagination } from '../../core/paginations/pagination';

const reactionUserSelect = {
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

export const getReactions = async (
  filters: IndexReactionsQuery
): Promise<IndexReactionsData> => {
  const { skip, take } = buildPagination(filters);

  const where = {
    ...(filters.commentId ? { commentId: filters.commentId } : {}),
    ...(filters.excludeUserId
      ? { userId: { not: filters.excludeUserId } }
      : {}),
    ...(filters.postId ? { postId: filters.postId } : {}),
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.userId ? { userId: filters.userId } : {}),
  };

  const [rows, count] = await prisma.$transaction([
    prisma.reaction.findMany({
      include: { user: { select: reactionUserSelect } },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      where,
    }),
    prisma.reaction.count({ where }),
  ]);

  return { count, data: rows as IndexReactionsData['data'] };
};

const syncReactionsDetails = async (
  postId: null | string,
  commentId: null | string
): Promise<void> => {
  if (postId) {
    const groups = await prisma.reaction.groupBy({
      _count: { type: true },
      by: ['type'],
      where: { postId },
    });
    const details = Object.fromEntries(
      groups.map(g => [g.type, g._count.type])
    );
    await prisma.post.update({
      data: { reactionsDetails: details },
      where: { id: postId },
    });
  } else if (commentId) {
    const groups = await prisma.reaction.groupBy({
      _count: { type: true },
      by: ['type'],
      where: { commentId },
    });
    const details = Object.fromEntries(
      groups.map(g => [g.type, g._count.type])
    );
    await prisma.comment.update({
      data: { reactionsDetails: details },
      where: { id: commentId },
    });
  }
};

export const toggleReaction = async (
  userId: string,
  body: ToggleReactionBody
): Promise<{ reaction: null | ReactionModel; toggled: boolean }> => {
  const { commentId, postId, type } = body;

  const where = commentId
    ? { userId_commentId: { commentId, userId } }
    : { userId_postId: { postId: postId!, userId } };

  const existing = await prisma.reaction.findUnique({ where });

  if (existing) {
    await prisma.$transaction([
      prisma.reaction.delete({ where }),
      ...(postId
        ? [
            prisma.post.update({
              data: { reactionsCount: { decrement: 1 } },
              where: { id: postId },
            }),
          ]
        : []),
      ...(commentId
        ? [
            prisma.comment.update({
              data: { reactionsCount: { decrement: 1 } },
              where: { id: commentId },
            }),
          ]
        : []),
    ]);

    await syncReactionsDetails(postId ?? null, commentId ?? null);

    return { reaction: null, toggled: false };
  }

  const [reaction] = await prisma.$transaction([
    prisma.reaction.create({
      data: {
        commentId: commentId ?? null,
        postId: postId ?? null,
        type,
        userId,
      },
    }),
    ...(postId
      ? [
          prisma.post.update({
            data: { reactionsCount: { increment: 1 } },
            where: { id: postId },
          }),
        ]
      : []),
    ...(commentId
      ? [
          prisma.comment.update({
            data: { reactionsCount: { increment: 1 } },
            where: { id: commentId },
          }),
        ]
      : []),
  ]);

  await syncReactionsDetails(postId ?? null, commentId ?? null);

  return { reaction: reaction as ReactionModel, toggled: true };
};
