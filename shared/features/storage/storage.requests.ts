import type { Request } from '../../utils/request';
import type {
  PostFileParams,
  PresignBody,
  PresignDocumentBody,
  SignedUrlQuery,
  UserAvatarParams,
} from './storage.schema';

export type GetSignedUrlData = { url: string };
export type GetSignedUrlRequest = Request<
  GetSignedUrlData,
  Record<string, never>,
  Record<string, never>,
  SignedUrlQuery
>;

export type PresignPostFileData = {
  path: string;
  publicUrl: string;
  uploadUrl: string;
};
export type PresignPostFileRequest = Request<
  PresignPostFileData,
  PresignDocumentBody,
  PostFileParams
>;

export type PresignUserAvatarData = { publicUrl: string; uploadUrl: string };
export type PresignUserAvatarRequest = Request<
  PresignUserAvatarData,
  PresignBody,
  UserAvatarParams
>;
