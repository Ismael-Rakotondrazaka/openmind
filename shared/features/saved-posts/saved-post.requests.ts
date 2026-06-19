import type { Request } from '../../utils/request';
import type { PaginationResult } from '../paginations';
import type { SavedPostModel } from './saved-post.model';
import type {
  IndexSavedPostsQuery,
  IsSavedPostQuery,
  ToggleSavedPostBody,
} from './saved-post.schema';

export type IndexSavedPostsData = PaginationResult<SavedPostModel>;
export type IndexSavedPostsRequest = Request<
  IndexSavedPostsData,
  Record<string, never>,
  Record<string, never>,
  IndexSavedPostsQuery
>;

export type IsSavedPostData = { isSaved: boolean };

export type IsSavedPostRequest = Request<
  IsSavedPostData,
  Record<string, never>,
  Record<string, never>,
  IsSavedPostQuery
>;
export type ToggleSavedPostRequest = Request<
  { saved: boolean; savedPost: null | SavedPostModel },
  ToggleSavedPostBody
>;
