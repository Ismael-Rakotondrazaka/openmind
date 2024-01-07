import qs from "qs";
import type { H3Event } from "h3";
import type { SafeParseReturnType, output, input, ZodTypeAny } from "zod";
import { zfd } from "zod-form-data";

export const safeParseRequestQueryAs = <T extends ZodTypeAny>(
  event: H3Event,
  schema: T,
): Promise<
  SafeParseReturnType<input<typeof schema>, output<typeof schema>>
> => {
  const queryString = getRequestURL(event).search;
  const query: qs.ParsedQs = qs.parse(queryString, {
    ignoreQueryPrefix: true,
  });

  return zfd.formData(schema).safeParseAsync(query);
};
