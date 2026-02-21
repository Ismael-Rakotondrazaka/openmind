import type { SortOrder } from '#imports';

export type Post = {
  author: Tables<'users'>;
  tags: { tag: Tables<'tags'> }[];
} & Tables<'posts'>;

export interface PostFilters {
  author_id?: string;
  limit?: number;
  orderBy?: PostOrderBy;
  page?: number;
  search?: string;
  sortOrder?: SortOrder;
}

export type PostInsert = TablesInsert<'posts'>;
export type PostOrderBy = 'created_at';
export type PostUpdate = TablesUpdate<'posts'>;
