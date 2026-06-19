import type {
  CommentModel,
  CommentWithAuthor,
  CreateCommentBody,
  IndexCommentsQuery,
  UpdateCommentBody,
} from '#shared/features/comments';
import type { PaginationResult } from '#shared/features/paginations';

import { CommentConfig } from '#shared/features/comments';
import { SortOrder } from '#shared/utils/enums';

import type { InputJsonValue } from '../../../prisma/generated/client/internal/prismaNamespace';

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

export const getComments = async (
  filters: IndexCommentsQuery
): Promise<PaginationResult<CommentWithAuthor>> => {
  const page = filters.page ?? CommentConfig.PAGE_DEFAULT;
  const pageSize = filters.pageSize ?? CommentConfig.PAGE_SIZE_DEFAULT;
  const skip = (page - 1) * pageSize;

  const where = {
    deletedAt: null,
    parentId: filters.parentId ?? null,
    postId: filters.postId,
  };

  const [rows, count] = await prisma.$transaction([
    prisma.comment.findMany({
      include: { author: { select: userSelect } },
      orderBy: { createdAt: filters.sortOrder ?? SortOrder.asc },
      skip,
      take: pageSize,
      where,
    }),
    prisma.comment.count({ where }),
  ]);

  return { count, data: rows as unknown as CommentWithAuthor[] };
};

export const getComment = async (id: string): Promise<CommentModel | null> => {
  return prisma.comment.findFirst({
    where: { deletedAt: null, id },
  }) as Promise<CommentModel | null>;
};

export const getCommentWithAuthor = async (
  id: string
): Promise<CommentWithAuthor | null> => {
  return prisma.comment.findFirst({
    include: { author: { select: userSelect } },
    where: { deletedAt: null, id },
  }) as Promise<CommentWithAuthor | null>;
};

export const createComment = async (
  authorId: string,
  input: CreateCommentBody
): Promise<CommentModel> => {
  const depth = input.parentId ? 1 : 0;

  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        authorId,
        content: input.content as unknown as InputJsonValue,
        depth,
        parentId: input.parentId ?? null,
        postId: input.postId,
      },
    }),
    prisma.post.update({
      data: { commentsCount: { increment: 1 } },
      where: { id: input.postId },
    }),
  ]);

  return comment as CommentModel;
};

export const updateComment = async (
  id: string,
  input: UpdateCommentBody
): Promise<CommentModel> => {
  return prisma.comment.update({
    data: { content: input.content as unknown as InputJsonValue },
    where: { id },
  }) as Promise<CommentModel>;
};

export const deleteComment = async (
  id: string,
  postId: string
): Promise<void> => {
  await prisma.$transaction([
    prisma.comment.update({
      data: { deletedAt: new Date() },
      where: { id },
    }),
    prisma.post.update({
      data: { commentsCount: { decrement: 1 } },
      where: { id: postId },
    }),
  ]);
};
