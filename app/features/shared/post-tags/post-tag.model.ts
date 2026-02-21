export type PostTag = Tables<'post_tags'>;

export interface PostTagFilters {
  limit?: number;
  page?: number;
  post_id?: string;
  tag_id?: string;
}

export type PostTagInsert = TablesInsert<'post_tags'>;
