import type { PaginationResult } from '#shared/features/paginations/pagination.model';
import type {
  UserTagModel,
  UserTagWithDetailsModel,
} from '#shared/features/user-tags';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export const indexUserTags = async (filters: {
  limit?: number;
  page?: number;
  tagId?: string;
  userId?: string;
}): Promise<PaginationResult<UserTagWithDetailsModel>> => {
  const page = filters.page ?? DEFAULT_PAGE;
  const limit = filters.limit ?? DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const where = {
    ...(filters.tagId ? { tagId: filters.tagId } : {}),
    ...(filters.userId ? { userId: filters.userId } : {}),
  };

  const [data, count] = await prisma.$transaction([
    prisma.userTag.findMany({
      include: { tag: true },
      skip,
      take: limit,
      where,
    }),
    prisma.userTag.count({ where }),
  ]);

  return {
    count,
    data: data.map(r => ({
      tag: { id: r.tag.id, slug: r.tag.slug, value: r.tag.value },
      tagId: r.tagId,
      userId: r.userId,
    })),
  };
};

export const createUserTag = async (
  userId: string,
  tagId: string
): Promise<UserTagModel> => {
  const result = await prisma.userTag.create({ data: { tagId, userId } });
  return { tagId: result.tagId, userId: result.userId };
};

export const deleteUserTag = async (
  userId: string,
  tagId: string
): Promise<void> => {
  await prisma.userTag.delete({
    where: { userId_tagId: { tagId, userId } },
  });
};
