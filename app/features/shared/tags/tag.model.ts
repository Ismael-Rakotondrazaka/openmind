export type Tag = Tables<'tags'>;

export interface TagFilters {
  limit?: number;
  page?: number;
  search?: string;
}

export type TagInsert = TablesInsert<'tags'>;
export type TagUpdate = TablesUpdate<'tags'>;
