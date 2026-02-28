export type Follow = {
  follower: Tables<'users'>;
} & Tables<'follows'>;

export interface FollowFilters {
  follower_id?: string;
  following_id?: string;
  limit?: number;
  page?: number;
}

export type FollowInsert = TablesInsert<'follows'>;

export type FollowUpdate = TablesUpdate<'follows'>;
export type FollowWithFollowing = {
  following: Tables<'users'>;
} & Tables<'follows'>;
