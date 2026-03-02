import type { OutputData } from '@editorjs/editorjs';
import type { SortOrder } from '#imports';

import type { ReactionType } from '../reactions/reaction.model';

export type Post = {
  author: Tables<'users'>;
  content: OutputData;
  reactions_details: Partial<Record<ReactionType, number>>;
  status: PostStatus;
  tags: { tag: Tables<'tags'> }[];
} & Omit<Tables<'posts'>, 'content' | 'reactions_details' | 'status'>;

export interface PostFilters {
  author_id?: string;
  limit?: number;
  orderBy?: PostOrderBy;
  page?: number;
  search?: string;
  sortOrder?: SortOrder;
  status?: PostStatus;
  tagIds?: string[];
}

export const PostStatuses = ['draft', 'published'] as const;

export const PostStatus = createEnumConstants(PostStatuses);

export const PostStatusLabel: Record<PostStatus, string> = {
  [PostStatus.draft]: 'Draft',
  [PostStatus.published]: 'Published',
};

export type PostInsert = TablesInsert<'posts'>;
export type PostOrderBy = 'created_at' | 'reactions_count';
export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];
export type PostUpdate = TablesUpdate<'posts'>;
