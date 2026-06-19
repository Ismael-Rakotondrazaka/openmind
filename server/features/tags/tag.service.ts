import type { PaginationResult } from '#shared/features/paginations';
import type {
  CreateTagBody,
  IndexTagsQuery,
  TagModel,
  TagParams,
} from '#shared/features/tags';

import { buildPagination } from '../../core/paginations/pagination';

export const getTags = async (
  filters: IndexTagsQuery
): Promise<PaginationResult<TagModel>> => {
  const { skip, take } = buildPagination(filters);

  const where = filters.search
    ? { value: { contains: filters.search, mode: 'insensitive' as const } }
    : {};

  const [rows, count] = await prisma.$transaction([
    prisma.tag.findMany({ orderBy: { value: 'asc' }, skip, take, where }),
    prisma.tag.count({ where }),
  ]);

  return { count, data: rows as TagModel[] };
};

export const createTag = async (input: CreateTagBody): Promise<TagModel> => {
  const slug = input.value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return prisma.tag.create({
    data: { slug, value: input.value },
  }) as Promise<TagModel>;
};

export const deleteTag = async (params: TagParams): Promise<void> => {
  await prisma.tag.delete({ where: { id: params.tagId } });
};
