import type { OutputData } from '@editorjs/editorjs';

import type { CommentModel } from '../../../prisma/generated/client/models';
import type { ReactionType } from '../reactions/reaction.model';
import type { UserProfile } from '../users/user.model';

export type { CommentModel };

export type Comment = {
  content?: OutputData;
  reactionsDetails: Partial<Record<ReactionType, number>>;
} & Omit<CommentWithAuthor, 'content' | 'reactionsDetails'>;

export type CommentWithAuthor = {
  author: UserProfile;
} & CommentModel;
