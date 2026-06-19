import type { Request } from '../../utils/request';
import type { PaginationResult } from '../paginations';
import type { PostDetail, PostModel, PostWithAuthor } from './post.model';
import type {
  CreatePostBody,
  IndexPostsQuery,
  PostParams,
  UpdatePostBody,
} from './post.schema';

export type DestroyPostData = { data: PostModel };
export type DestroyPostRequest = Request<
  DestroyPostData,
  Record<string, never>,
  PostParams
>;

export type IndexPostsData = PaginationResult<PostWithAuthor>;
export type IndexPostsRequest = Request<
  IndexPostsData,
  Record<string, never>,
  Record<string, never>,
  IndexPostsQuery
>;

export type PublishPostData = { data: PostModel };
export type PublishPostRequest = Request<
  PublishPostData,
  Record<string, never>,
  PostParams
>;

export type ShowPostData = { data: PostDetail };
export type ShowPostRequest = Request<
  ShowPostData,
  Record<string, never>,
  PostParams
>;

export type StorePostData = { data: PostModel };
export type StorePostRequest = Request<StorePostData, CreatePostBody>;

export type UpdatePostData = { data: PostModel };
export type UpdatePostRequest = Request<
  UpdatePostData,
  UpdatePostBody,
  PostParams
>;
