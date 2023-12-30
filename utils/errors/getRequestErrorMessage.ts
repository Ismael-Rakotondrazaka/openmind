import { z } from "zod";

export type RequestErrorMessage<T> = Partial<
  Record<keyof T, string | undefined>
>;

export const getRequestErrorMessage = <T>(
  parseError: z.SafeParseError<T>,
): RequestErrorMessage<T> => {
  const getEventQuerySuccessParseResult: z.typeToFlattenedError<T, string> =
    parseError.error.flatten((issue: z.ZodIssue) => issue.message);

  const result: RequestErrorMessage<T> = {} as RequestErrorMessage<T>;

  const fieldErrors = getEventQuerySuccessParseResult.fieldErrors;

  for (const key in fieldErrors) {
    if (Object.prototype.hasOwnProperty.call(fieldErrors, key)) {
      const messageValue: string[] | undefined =
        fieldErrors[key as keyof typeof fieldErrors];

      if (messageValue !== undefined) {
        result[key as keyof typeof fieldErrors] = messageValue[0];
      }
    }
  }

  return result;
};
