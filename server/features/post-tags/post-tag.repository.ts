import type { PaginationResult } from '#shared/features/paginations/pagination.model';
import type { PostTagModel } from '#shared/features/post-tags';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export const indexPostTags = async (filters: {
  limit?: number;
  page?: number;
  postId?: string;
  tagId?: string;
}): Promise<PaginationResult<PostTagModel>> => {
  const page = filters.page ?? DEFAULT_PAGE;
  const limit = filters.limit ?? DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const where = {
    ...(filters.postId ? { postId: filters.postId } : {}),
    ...(filters.tagId ? { tagId: filters.tagId } : {}),
  };

  const [data, count] = await prisma.$transaction([
    prisma.postTag.findMany({ skip, take: limit, where }),
    prisma.postTag.count({ where }),
  ]);

  return {
    count,
    data: data.map(r => ({ postId: r.postId, tagId: r.tagId })),
  };
};

export const createPostTag = async (
  postId: string,
  tagId: string
): Promise<PostTagModel> => {
  const result = await prisma.postTag.create({
    data: { postId, tagId },
  });
  return { postId: result.postId, tagId: result.tagId };
};

export const deletePostTag = async (
  postId: string,
  tagId: string
): Promise<void> => {
  await prisma.postTag.delete({
    where: { postId_tagId: { postId, tagId } },
  });
};
