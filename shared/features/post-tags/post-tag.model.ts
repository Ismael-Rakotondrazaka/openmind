export interface PostTagFilters {
  limit?: number;
  page?: number;
  postId?: string;
  tagId?: string;
}

export interface PostTagModel {
  postId: string;
  tagId: string;
}
