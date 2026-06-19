import type { OutputData } from '@editorjs/editorjs';

import type {
  PostModel,
  TagModel,
} from '../../../prisma/generated/client/models';
import type { ReactionType } from '../reactions/reaction.model';
import type { UserProfile } from '../users/user.model';

export type { PostModel };

export type PostDetail = {
  author: UserProfile;
  tags: { tag: TagModel }[];
} & PostModel;

export type PostWithAuthor = {
  author: UserProfile;
  tags: { tag: TagModel }[];
} & PostSummary;

export const PostStatus = {
  draft: 'draft',
  published: 'published',
} as const;

export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];

export const PostStatuses = ['draft', 'published'] as const;

export const PostStatusLabel: Record<PostStatus, string> = {
  draft: 'statuses.announcement.draft',
  published: 'statuses.announcement.published',
};

export const PostReactionType = {
  celebrate: 'celebrate',
  like: 'like',
  love: 'love',
} as const;

export type Post = {
  content?: OutputData;
  reactionsDetails: PostReactionsDetails;
} & Omit<PostDetail, 'content' | 'reactionsDetails'>;

export type PostListItem = PostWithAuthor;

export type PostOrderBy = 'createdAt' | 'reactionsCount';

export type PostReactionsDetails = Partial<Record<ReactionType, number>>;

export type PostReactionType =
  (typeof PostReactionType)[keyof typeof PostReactionType];

export type PostSummary = Pick<
  PostModel,
  | 'authorId'
  | 'commentsCount'
  | 'coverUrl'
  | 'createdAt'
  | 'deletedAt'
  | 'id'
  | 'publishedAt'
  | 'reactionsCount'
  | 'reactionsDetails'
  | 'slug'
  | 'status'
  | 'title'
  | 'updatedAt'
  | 'viewsCount'
>;

export type PostView = Post | PostListItem;
