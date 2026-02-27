import type { OutputData } from '@editorjs/editorjs';
import type { SortOrder } from '#imports';

import type { ReactionType } from '../reactions/reaction.model';

export type Comment = {
  author: Tables<'users'>;
  content: OutputData;
  reactions_details: Partial<Record<ReactionType, number>>;
} & Omit<Tables<'comments'>, 'content' | 'reactions_details'>;

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
