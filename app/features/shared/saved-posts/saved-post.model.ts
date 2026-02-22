import type { Post } from '~/features/shared/posts/post.model';

export type SavedPost = { post: Post } & Tables<'saved_posts'>;

export interface SavedPostFilters {
  limit?: number;
  page?: number;
  post_id?: string;
  user_id?: string;
}

export type SavedPostInsert = TablesInsert<'saved_posts'>;
export type SavedPostUpdate = TablesUpdate<'saved_posts'>;
