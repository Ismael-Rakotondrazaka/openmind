export const ReactionTypes = ['like', 'love', 'celebrate'] as const;

export const ReactionType = createEnumConstants(ReactionTypes);

export type ReactionType = (typeof ReactionType)[keyof typeof ReactionType];

export const ReactionTypeLabel: Record<ReactionType, string> = {
  [ReactionType.celebrate]: 'Celebrate',
  [ReactionType.like]: 'Like',
  [ReactionType.love]: 'Love',
};

export type Reaction = Tables<'reactions'>;

export interface ReactionFilters {
  comment_id?: string;
  limit?: number;
  page?: number;
  post_id?: string;
  type?: ReactionType;
  user_id?: string;
}

export type ReactionInsert = TablesInsert<'reactions'>;
export type ReactionUpdate = TablesUpdate<'reactions'>;
