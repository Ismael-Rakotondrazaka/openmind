import type { H3Event } from "h3";
import type { SafeParseReturnType, ZodTypeAny, input, output } from "zod";
import { zfd } from "zod-form-data";

export const safeParseRequestParamAs = <T extends ZodTypeAny>(
  event: H3Event,
  schema: T,
): Promise<
  SafeParseReturnType<input<typeof schema>, output<typeof schema>>
> => {
  const params = getRouterParams(event);

  return zfd.formData(schema).safeParseAsync(params);
};
