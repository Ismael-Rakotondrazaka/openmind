export type SavedPost = Tables<'saved_posts'>;

export interface SavedPostFilters {
  limit?: number;
  page?: number;
  post_id?: string;
  user_id?: string;
}

export type SavedPostInsert = TablesInsert<'saved_posts'>;
export type SavedPostUpdate = TablesUpdate<'saved_posts'>;
