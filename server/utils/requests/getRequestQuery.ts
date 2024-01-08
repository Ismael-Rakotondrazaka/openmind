import type { H3Event } from "h3";
import { parseNestedJSON } from "~/utils";

export const getRequestQuery = (event: H3Event): Record<string, unknown> => {
  const query = getQuery(event);

  const nestedParsed: Record<string, unknown> = parseNestedJSON(query);

  return nestedParsed;
};
