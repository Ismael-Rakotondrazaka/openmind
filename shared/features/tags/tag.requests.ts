import type { Request } from '../../utils/request';
import type { PaginationResult } from '../paginations';
import type { TagModel } from './tag.model';
import type { CreateTagBody, IndexTagsQuery, TagParams } from './tag.schema';

export type DestroyTagData = { data: TagModel };
export type DestroyTagRequest = Request<
  DestroyTagData,
  Record<string, never>,
  TagParams
>;

export type IndexTagsData = PaginationResult<TagModel>;
export type IndexTagsRequest = Request<
  IndexTagsData,
  Record<string, never>,
  Record<string, never>,
  IndexTagsQuery
>;

export type StoreTagData = { data: TagModel };
export type StoreTagRequest = Request<StoreTagData, CreateTagBody>;
