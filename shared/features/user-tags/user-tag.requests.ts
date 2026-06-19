import type { Request } from '../../utils/request';
import type { PaginationResult } from '../paginations/pagination.model';
import type { UserTagModel, UserTagWithDetailsModel } from './user-tag.model';
import type {
  CreateUserTagBody,
  UpdateUserTagBody,
  UserTagParams,
  UserTagQuery,
} from './user-tag.schema';

export type CreateUserTagRequest = Request<UserTagModel, CreateUserTagBody>;
export type DeleteUserTagRequest = Request<
  { success: true },
  Record<string, never>,
  UserTagParams
>;
export type IndexUserTagsRequest = Request<
  PaginationResult<UserTagWithDetailsModel>,
  Record<string, never>,
  Record<string, never>,
  UserTagQuery
>;
export type UpdateUserTagRequest = Request<
  UserTagModel,
  UpdateUserTagBody,
  UserTagParams
>;
