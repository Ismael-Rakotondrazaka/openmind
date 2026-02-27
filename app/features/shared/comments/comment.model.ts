import type { OutputData } from '@editorjs/editorjs';
import type { SortOrder } from '#imports';

export type Comment = {
  author: Tables<'users'>;
  content: OutputData;
} & Omit<Tables<'comments'>, 'content'>;

export interface CommentFilters {
  author_id?: string;
  before?: string;
  depth?: number;
  limit?: number;
  orderBy?: CommentOrderBy;
  parent_id?: null | string;
  post_id?: string;
  sortOrder?: SortOrder;
}

export type CommentInsert = TablesInsert<'comments'>;
export type CommentOrderBy = 'created_at';
export type CommentUpdate = TablesUpdate<'comments'>;
