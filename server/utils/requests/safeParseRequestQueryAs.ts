import type { H3Event } from "h3";
import type { SafeParseReturnType, output, input, ZodTypeAny } from "zod";
import { zfd } from "zod-form-data";
import { getRequestQuery } from "~/server/utils/requests/getRequestQuery";

export const safeParseRequestQueryAs = <T extends ZodTypeAny>(
  event: H3Event,
  schema: T,
): Promise<
  SafeParseReturnType<input<typeof schema>, output<typeof schema>>
> => {
  const query = getRequestQuery(event);

  return zfd.formData(schema).safeParseAsync(query);
};
