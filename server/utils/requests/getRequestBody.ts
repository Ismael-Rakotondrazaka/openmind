import type { H3Event } from "h3";

export const getRequestBody = async (e: H3Event): Promise<unknown> => {
  let result: unknown = {};

  const requestContentType: string | undefined = getHeader(e, "Content-Type");

  if (requestContentType !== undefined) {
    if (requestContentType.startsWith("application/json")) {
      const JSONBody: any = await readBody(e);

      if (JSONBody !== undefined && JSONBody !== null) {
        result = JSONBody;
      }
    } else if (
      requestContentType.startsWith("application/x-www-form-urlencoded") ||
      requestContentType.startsWith("multipart/form-data")
    ) {
      result = await readFormData(e);
    }
  }

  return result;
};
