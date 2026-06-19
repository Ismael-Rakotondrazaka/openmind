import type { Request } from '../../utils/request';
import type { PaginationResult } from '../paginations';
import type { FollowModel, FollowWithUsers } from './follow.model';
import type { IndexFollowsQuery, ToggleFollowBody } from './follow.schema';

export type IndexFollowsRequest = Request<
  PaginationResult<FollowWithUsers>,
  Record<string, never>,
  Record<string, never>,
  IndexFollowsQuery
>;

export type ToggleFollowRequest = Request<
  { follow: FollowModel | null; following: boolean },
  ToggleFollowBody
>;
