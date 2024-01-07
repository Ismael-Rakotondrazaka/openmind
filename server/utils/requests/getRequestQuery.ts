import type { H3Event } from "h3";
import { destr } from "destr";

export const getRequestQuery = (event: H3Event): Record<string, unknown> => {
  const query = getQuery(event);

  const nestedParsed: Record<string, unknown> = {};

  for (const key in query) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      nestedParsed[key] = destr(query[key]);
    }
  }

  return nestedParsed;
};
