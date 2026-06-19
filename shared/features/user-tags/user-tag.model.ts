export interface UserTagModel {
  tagId: string;
  userId: string;
}

export type UserTagWithDetails = UserTagWithDetailsModel;

export interface UserTagWithDetailsModel {
  tag: { id: string; slug: string; value: string };
  tagId: string;
  userId: string;
}
