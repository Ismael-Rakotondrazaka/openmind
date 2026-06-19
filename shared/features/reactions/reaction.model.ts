import type { ReactionModel } from '../../../prisma/generated/client/models';
import type { UserProfile } from '../users/user.model';

export type { ReactionModel };

export const ReactionTypes = ['like', 'love', 'celebrate', 'insightful'] as const;

export const ReactionType = {
  celebrate: 'celebrate',
  insightful: 'insightful',
  like: 'like',
  love: 'love',
} as const;

export type ReactionType = (typeof ReactionType)[keyof typeof ReactionType];

export const ReactionTypeLabel: Record<ReactionType, string> = {
  celebrate: 'reactions.celebrate',
  insightful: 'reactions.insightful',
  like: 'reactions.like',
  love: 'reactions.love',
};

export type Reaction = { type: ReactionType } & ReactionModel;

export interface ReactionFilters {
  commentId?: string;
  limit?: number;
  page?: number;
  postId?: string;
  type?: ReactionType;
  userId?: string;
}

export interface ReactionUserPreview {
  firstName: null | string;
  id: string;
  lastName: null | string;
  username: null | string;
}

export type ReactionWithUser = { user: UserProfile } & Reaction;

export type ReactionWithUserModel = { user: UserProfile } & ReactionModel;

export const ReactionStatusIcon: {
  active: Record<ReactionType, string>;
  inactive: Record<ReactionType, string>;
} = {
  active: {
    celebrate: 'mdi:party-popper',
    insightful: 'mdi:lightbulb',
    like: 'mdi:thumb-up',
    love: 'mdi:heart',
  },
  inactive: {
    celebrate: 'lucide:party-popper',
    insightful: 'mdi:lightbulb-outline',
    like: 'mdi:thumb-up-outline',
    love: 'mdi:heart-outline',
  },
};
