export type Reaction = Tables<'reactions'>;

export interface ReactionFilters {
  comment_id?: string;
  limit?: number;
  page?: number;
  post_id?: string;
  type?: string;
  user_id?: string;
}

export type ReactionInsert = TablesInsert<'reactions'>;
export type ReactionUpdate = TablesUpdate<'reactions'>;
