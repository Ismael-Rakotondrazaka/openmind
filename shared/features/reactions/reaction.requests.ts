import type { Request } from '../../utils/request';
import type { PaginationResult } from '../paginations';
import type { ReactionModel, ReactionWithUserModel } from './reaction.model';
import type {
  IndexReactionsQuery,
  ToggleReactionBody,
} from './reaction.schema';

export type IndexReactionsData = PaginationResult<ReactionWithUserModel>;
export type IndexReactionsRequest = Request<
  IndexReactionsData,
  Record<string, never>,
  Record<string, never>,
  IndexReactionsQuery
>;

export type ToggleReactionRequest = Request<
  { reaction: null | ReactionModel; toggled: boolean },
  ToggleReactionBody
>;
