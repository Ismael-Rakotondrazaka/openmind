import type { Request } from '../../utils/request';
import type { PaginationResult } from '../paginations';
import type { CommentModel, CommentWithAuthor } from './comment.model';
import type {
  CommentParams,
  CreateCommentBody,
  IndexCommentsQuery,
  UpdateCommentBody,
} from './comment.schema';

export type DestroyCommentData = { data: CommentModel };
export type DestroyCommentRequest = Request<
  DestroyCommentData,
  Record<string, never>,
  CommentParams
>;

export type IndexCommentsData = PaginationResult<CommentWithAuthor>;
export type IndexCommentsRequest = Request<
  IndexCommentsData,
  Record<string, never>,
  Record<string, never>,
  IndexCommentsQuery
>;

export type StoreCommentData = { data: CommentModel };
export type StoreCommentRequest = Request<StoreCommentData, CreateCommentBody>;

export type UpdateCommentData = { data: CommentModel };
export type UpdateCommentRequest = Request<
  UpdateCommentData,
  UpdateCommentBody,
  CommentParams
>;
