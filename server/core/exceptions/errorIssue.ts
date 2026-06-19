import type { ResponseErrorIssue } from '#shared/responses/response';

export const errorIssue = (
  key: string,
  params: Record<string, number | string> = {}
): ResponseErrorIssue => [key, params];
