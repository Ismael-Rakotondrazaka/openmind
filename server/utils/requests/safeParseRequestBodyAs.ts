import type { SafeParseReturnType, output, input, ZodTypeAny } from "zod";
import { zfd } from "zod-form-data";
import { H3Event } from "h3";

export const safeParseRequestBodyAs = async <T extends ZodTypeAny>(
  event: H3Event,
  schema: T,
): Promise<
  SafeParseReturnType<input<typeof schema>, output<typeof schema>>
> => {
  const body = await getRequestBody(event);

  return zfd.formData(schema).safeParseAsync(body);
};
