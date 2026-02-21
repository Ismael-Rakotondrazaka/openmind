import type { SortOrder } from '#imports';

export type Comment = {
  author: Tables<'users'>;
} & Tables<'comments'>;

export interface CommentFilters {
  author_id?: string;
  limit?: number;
  orderBy?: CommentOrderBy;
  page?: number;
  post_id?: string;
  sortOrder?: SortOrder;
}

export type CommentInsert = TablesInsert<'comments'>;
export type CommentOrderBy = 'created_at';
export type CommentUpdate = TablesUpdate<'comments'>;
