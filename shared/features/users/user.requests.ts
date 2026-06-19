import type { Request } from '../../utils/request';
import type { PaginationResult } from '../paginations';
import type { UserProfile } from './user.model';
import type {
  IndexUsersQuery,
  UpdateProfileBody,
  UsernameExistsQuery,
  UserParams,
} from './user.schema';

export type DestroyUserData = { data: UserProfile };
export type DestroyUserRequest = Request<
  DestroyUserData,
  Record<string, never>,
  UserParams
>;

export type IndexUsersData = PaginationResult<UserProfile>;
export type IndexUsersRequest = Request<
  IndexUsersData,
  Record<string, never>,
  Record<string, never>,
  IndexUsersQuery
>;

export type ShowUserData = { data: UserProfile };
export type ShowUserRequest = Request<
  ShowUserData,
  Record<string, never>,
  UserParams
>;

export type UpdateProfileData = { data: UserProfile };
export type UpdateProfileRequest = Request<
  UpdateProfileData,
  UpdateProfileBody,
  UserParams
>;

export type UsernameExistsData = { exists: boolean };
export type UsernameExistsRequest = Request<
  UsernameExistsData,
  Record<string, never>,
  Record<string, never>,
  UsernameExistsQuery
>;
