import type { Request } from '../../utils/request';
import type { PaginationResult } from '../paginations/pagination.model';
import type { PostTagModel } from './post-tag.model';
import type {
  CreatePostTagBody,
  PostTagParams,
  PostTagQuery,
} from './post-tag.schema';

export type CreatePostTagRequest = Request<PostTagModel, CreatePostTagBody>;
export type DeletePostTagRequest = Request<
  { success: true },
  Record<string, never>,
  PostTagParams
>;
export type IndexPostTagsRequest = Request<
  PaginationResult<PostTagModel>,
  Record<string, never>,
  Record<string, never>,
  PostTagQuery
>;
