import type { InputJsonValue } from '@prisma/client/runtime/client';
import type { PaginationResult } from '#shared/features/paginations';
import type {
  CreatePostBody,
  IndexPostsQuery,
  PostDetail,
  PostModel,
  PostWithAuthor,
  UpdatePostBody,
} from '#shared/features/posts';

import { PostConfig } from '#shared/features/posts';

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

const postSummarySelect = {
  author: { select: userSelect },
  authorId: true,
  commentsCount: true,
  coverUrl: true,
  createdAt: true,
  id: true,
  publishedAt: true,
  reactionsCount: true,
  reactionsDetails: true,
  slug: true,
  status: true,
  tags: { select: { tag: true } },
  title: true,
  updatedAt: true,
  viewsCount: true,
};

export const getPosts = async (
  filters: IndexPostsQuery,
  viewerUserId?: string
): Promise<PaginationResult<PostWithAuthor>> => {
  const page = filters.page ?? PostConfig.PAGE_DEFAULT;
  const pageSize = filters.pageSize ?? PostConfig.PAGE_SIZE_DEFAULT;
  const skip = (page - 1) * pageSize;

  const visibilityFilter = viewerUserId
    ? { OR: [{ status: 'published' as const }, { authorId: viewerUserId }] }
    : { status: 'published' as const };

  const orderByField =
    filters.orderBy === 'reactionsCount' ? 'reactionsCount' : 'createdAt';
  const orderByDir = filters.sortOrder ?? 'desc';

  const where = {
    AND: [
      { deletedAt: null },
      visibilityFilter,
      ...(filters.authorId ? [{ authorId: filters.authorId }] : []),
      ...(filters.search
        ? [
            {
              title: { contains: filters.search, mode: 'insensitive' as const },
            },
          ]
        : []),
      ...(filters.status ? [{ status: filters.status }] : []),
      ...(filters.tagSlug
        ? [{ tags: { some: { tag: { slug: filters.tagSlug } } } }]
        : []),
      ...(filters.tagIds?.length
        ? [{ tags: { some: { tagId: { in: filters.tagIds } } } }]
        : []),
    ],
  };

  const [rows, count] = await prisma.$transaction([
    prisma.post.findMany({
      orderBy: { [orderByField]: orderByDir },
      select: postSummarySelect,
      skip,
      take: pageSize,
      where,
    }),
    prisma.post.count({ where }),
  ]);

  return { count, data: rows as unknown as PostWithAuthor[] };
};

export const getPost = async (id: string): Promise<null | PostDetail> => {
  return prisma.post.findFirst({
    include: {
      author: { select: userSelect },
      tags: { include: { tag: true } },
    },
    where: { deletedAt: null, id },
  }) as unknown as Promise<null | PostDetail>;
};

export const createPost = async (
  authorId: string,
  input: CreatePostBody
): Promise<PostModel> => {
  const slug = `${input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}-${Date.now()}`;

  const isPublished = input.status === 'published';

  const data = {
    authorId,
    content: input.content as InputJsonValue,
    coverUrl: input.coverUrl ?? null,
    slug,
    status: input.status ?? 'draft',
    title: input.title,
    ...(isPublished ? { publishedAt: new Date() } : {}),
  };

  if (isPublished) {
    const [post] = await prisma.$transaction([
      prisma.post.create({ data }),
      prisma.user.update({
        data: { postsCount: { increment: 1 } },
        where: { id: authorId },
      }),
    ]);
    return post as PostModel;
  }

  return prisma.post.create({ data }) as Promise<PostModel>;
};

export const updatePost = async (
  id: string,
  input: UpdatePostBody
): Promise<PostModel> => {
  return prisma.post.update({
    data: {
      content: input.content as InputJsonValue,
      coverUrl: input.coverUrl ?? null,
      status: input.status ?? 'draft',
      title: input.title,
    },
    where: { id },
  }) as Promise<PostModel>;
};

export const publishPost = async (
  id: string,
  authorId: string
): Promise<PostModel> => {
  const [post] = await prisma.$transaction([
    prisma.post.update({
      data: { publishedAt: new Date(), status: 'published' },
      where: { id },
    }),
    prisma.user.update({
      data: { postsCount: { increment: 1 } },
      where: { id: authorId },
    }),
  ]);
  return post as PostModel;
};

export const deletePost = async (
  id: string,
  authorId: string,
  wasPublished: boolean
): Promise<void> => {
  await prisma.$transaction([
    prisma.post.update({
      data: { deletedAt: new Date() },
      where: { id },
    }),
    ...(wasPublished
      ? [
          prisma.user.update({
            data: { postsCount: { decrement: 1 } },
            where: { id: authorId },
          }),
        ]
      : []),
  ]);
};
