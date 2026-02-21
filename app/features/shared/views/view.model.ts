export type View = {
  user: Tables<'users'>;
} & Tables<'views'>;

export interface ViewFilters {
  limit?: number;
  page?: number;
  post_id?: string;
  user_id?: string;
}

export type ViewInsert = TablesInsert<'views'>;
export type ViewUpdate = TablesUpdate<'views'>;
