export type UserTag = Tables<'user_tags'>;

export interface UserTagFilters {
  limit?: number;
  page?: number;
  tag_id?: string;
  user_id?: string;
}

export type UserTagInsert = TablesInsert<'user_tags'>;

export type UserTagUpdate = TablesUpdate<'user_tags'>;
export type UserTagWithDetails = {
  tag: Tables<'tags'>;
  tag_id: string;
  user_id: string;
};
