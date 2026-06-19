import type { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { Simplify } from 'type-fest';

import type { Request } from '../requests/request';
import type { FlattenedPath } from '../types/flatten';

export interface ResponseError<
  TRequest extends Request<
    unknown,
    unknown,
    Record<string, never | number | string>,
    unknown
  >,
> {
  data: TRequest['input']['body'] extends Record<string, never>
    ? Record<string, never>
    : Simplify<ResponseErrorData<TRequest['input']['body']>>;
  message: string;
  stack: string;
  statusCode: StatusCodes;
  statusMessage: ReasonPhrases;
  url: string;
}

export type ResponseErrorData<TInput> = Partial<
  Record<FlattenedPath<TInput>, ResponseErrorIssue>
>;

export type ResponseErrorIssue = [
  // code
  string,
  // params
  Record<string, number | string>,
];
