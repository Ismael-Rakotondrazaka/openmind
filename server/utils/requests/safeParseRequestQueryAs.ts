import type { H3Event } from "h3";
import type { SafeParseReturnType, output, input, ZodTypeAny } from "zod";
import { zfd } from "zod-form-data";
import { destr } from "destr";

export const safeParseRequestQueryAs = <T extends ZodTypeAny>(
  event: H3Event,
  schema: T,
): Promise<
  SafeParseReturnType<input<typeof schema>, output<typeof schema>>
> => {
  const query = getQuery(event);

  const nestedParsed: Record<string, unknown> = {};

  for (const key in query) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      nestedParsed[key] = destr(query[key]);
    }
  }

  return zfd.formData(schema).safeParseAsync(nestedParsed);
};
